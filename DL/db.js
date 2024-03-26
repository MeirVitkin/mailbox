const mongoose = require('mongoose');

const URI_MONGO = process.env.URI_MONGO;

async function connect() {
    try {
        mongoose.connect(URI_MONGO)
            .then(() => console.log("****  DB - Connection Success ****"))
    } catch (err) {
        console.log("Error connecting to Mongo ", err);
    }
}

module.exports = { connect };
