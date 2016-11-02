const PouchDB = require('pouchdb');

const dbServer = 'http://localhost:5984';
const visitsDB = 'visits';
const db = new PouchDB(visitsDB);

const makeDoc = (doc) => {
    let id = (doc._id) ? doc._id : new Date().toISOString()
    return Object.assign(
        {},
        { _id: id },
        { _rev: doc._rev },
        doc
    )
}

export const visits = {

    fetch: (key) => {
        db.get(key)
            .then((doc) => { console.log(doc) })
            .catch((err) => { console.log('Error fetching doc', key, err) })
    },

    fetchAll: () => {
        return new Promise((resolve, reject) => {
            db.allDocs({
                include_docs: true,
                attachments: true
            })
                .then((docs) => { resolve(docs.rows) })
                .catch((err) => { reject(err) })
        })
    },

    add: (details) => {
        console.log('this', this)
        let payload = makeDoc(details)
        return new Promise((resolve, reject) => {
            db.put(payload)
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    },

    update: (details) => {
        return new Promise((resolve, reject) => {
            if (!details._id) { reject({ err: 'No id provided - cannot complete update' })}
            db.get(details._id)
                .then((doc) => { return db.put(details) })
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.get(id)
                .then((doc) => { return db.remove(doc) })
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    },

    sync: () => {
        db.sync(dbServer + '/' + visitsDB, { live: true, retry: true })
            .on('error', console.log.bind(console));
        console.log('Syncing...')                           //
    },

    subscribe: (handleUpdate) => {
        const changes = db.changes({
            since: 'now',
            live: true,
            include_docs: true
        })
            .on('change', (change) => { handleUpdate(change) })
            .on('complete', (info) => { console.log('Subscription ended', info) })
            .on('error', function (err) { console.log('Subscription error', err) })

        // changes.cancel(); // whenever you want to cancel
    }
}