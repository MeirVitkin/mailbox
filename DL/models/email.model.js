const mongoose = require('mongoose');
messageModel = require('./message.model');

const emailSchema = new mongoose.Schema({

    subject: {
        type: String,
    },
    lastDate: {
        type: Date
    },
    
    msg: [{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'message',
         }],
         

})


const emailModel = mongoose.model('email', emailSchema);

module.exports = emailModel;




