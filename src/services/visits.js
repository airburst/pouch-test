const PouchDB = require('pouchdb');

const dbServer = 'http://localhost:5984';
const visitsDB = 'visits';
const db = new PouchDB(visitsDB);

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
        let payload = Object.assign({}, { _id: new Date().toISOString() }, details)
        console.log(payload)
        db.put(payload)
            .then(result => { console.log('Added record', result) })
            .catch(err => console.log(err))
    },

    update: (id, details) => { },

    remove: (id) => {
        return new Promise((resolve, reject) => {
            db.get('mydoc')
                .then((doc) => { return db.remove(doc) })
                .then((result) => { resolve(result) })
                .catch((err) => { reject(err) })
        })
    },

    subscribe: () => {
        db.changes().on('change', () => {
            console.log('Ch-Ch-Changes');
        });
    },

    sync: () => {
        db.replicate.to(dbServer + '/' + visitsDB)
        console.log('Syncing...')                           //
    }
}