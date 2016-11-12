import PouchDB from 'pouchdb'

export class PouchService {

    constructor(database, remoteServer, username, password) {
        this.localDb = database
        this.db = new PouchDB(this.localDb, {
            auth: {
                username: username,
                password: password
            },
            auto_compaction: true,
            skipSetup: true
        })
        this.syncToken = {}
        this.willSync = (remoteServer) ? true : false
        this.remoteDb = (this.willSync) ? remoteServer + '/' + database : null
    }

    auth() {
        fetch('http://192.168.154.136:5984/_session', {
            method: 'post',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify({ name: 'bob', password: 'password' })
        })
            //.then(json)
            .then(data => { console.log('DEBUG: Auth response', data) })
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
        console.log('Subscribed to ' + this.localDb)
    }

    unsubscribe() {
        this.syncToken.cancel()
    }

    sync() {
        if (this.willSync) {
            // db.logIn(this.username, this.password)
            //     .then(response => {
            //         console.log('login', response)
            //         if (err) {
            //             if (err.name === 'unauthorized') {
            //                 console.log('Unauthorised')
            //             } else {
            this.db.sync(this.remoteDb, { live: true, retry: true })
                .on('error', console.log.bind(console));
            console.log('Syncing with ' + this.remoteDb)
            //         }
            //     }
            // })
            // .catch(err => console.log(err))
        }
    }
}
