import PouchDB from 'pouchdb'

export class PouchService {

    constructor(database, remoteServer, username, password) {
        this.database = database
        this.user = username
        this.pass = password
        this.db = new PouchDB(database, {
            auth: {
                username: username,
                password: password
            },
            auto_compaction: true,
            skipSetup: true
        })
        this.syncToken = {}
        this.willSync = (remoteServer) ? true : false
        this.remoteServer = remoteServer
        this.syncUrl = (this.willSync)
            ? 'http://' + username + ':' + password + '@'
            + remoteServer.replace('https://', '').replace('http://', '')
            + '/' + database
            : null
    }

    auth() {
        fetch(this.remoteServer + '/_session', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name: this.user, password: this.pass })
        })
            .then(data => { /*console.log('DEBUG: Auth response', data)*/ })
            .catch(error => { console.log('DEBUG: Auth failed', error) })
    }

    makeDoc(doc) {
        const id = (doc._id && (doc._id !== "")) ? doc._id : new Date().toISOString()
        doc._rev = undefined
        return Object.assign({}, doc, { _id: id })
    }

    fetchAll() {
        return new Promise((resolve, reject) => {
            this.db.allDocs({
                include_docs: true,
                attachments: true
            })
                .then((docs) => { resolve(docs.rows) })
                .catch((err) => { reject(err) })
        })
    }

    fetch(id) {
        return new Promise((resolve, reject) => {
            this.db.get(id)
                .then((doc) => { return doc })
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    }

    add(details) {
        let payload = this.makeDoc(details)
        return new Promise((resolve, reject) => {
            this.db.put(payload)
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    }

    update(details) {
        return new Promise((resolve, reject) => {
            if (!details._id) { reject({ err: 'No id provided - cannot complete update' }) }
            this.db.get(details._id)
                .then((doc) => { return this.db.put(details) })
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    }

    remove(id) {
        return new Promise((resolve, reject) => {
            this.db.get(id)
                .then((doc) => { return this.db.remove(doc) })
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    }

    subscribe(handleUpdate) {
        this.syncToken = this.db.changes({
            since: 'now',
            live: true,
            include_docs: true
        })
            .on('change', (change) => { handleUpdate(change) })
            .on('complete', (info) => { console.log('Subscription ended', info) })
            .on('error', function (err) { console.log('Subscription error', err) })
        console.log('Subscribed to ' + this.database)
    }

    unsubscribe() {
        this.syncToken.cancel()
    }

    sync() {
        if (this.willSync) {
            return new Promise((resolve, reject) => {
                this.db.sync(this.syncUrl, { live: true, retry: true })
                    .on('active', resolve('Syncing...'))
                    .on('error', reject('Unable to sync'))
            })
        }
    }
}
