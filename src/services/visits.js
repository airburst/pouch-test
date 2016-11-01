const PouchDB = require('pouchdb');
const db = new PouchDB('visits');

export const visits = {

    add: (details) => {
        let payload = Object.assign({}, { _id: new Date().toISOString() } , details)
        console.log(payload)
        // db.put(payload)
        //     .then(result => { console.log('Added record', result) })
    },

    update(id, details) {}

    // db.changes().on('change', function () {
    // console.log('Ch-Ch-Changes');
    // });

    // db.replicate.to('http://localhost:5984/visits');
}