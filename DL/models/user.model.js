const mongoose = require('mongoose');
messageModel = require('./message.model');

const userSchema = new mongoose.Schema({

    email: {
        type: String,
        unique: true,
        required: true
    },
    fullName: {
        type: String,
        required: true
    },
    svatar:String,
    password:{
        type: String,
        select: false
    },
     emails: [{
        email:{
            type: mongoose.SchemaTypes.ObjectId,
            ref: 'email',
        },
        isSent:Boolean,
        isRecieved:Boolean,
        isFavorite:Boolean,
        isDeleted:Boolean,
        isRead: {
            type:Boolean,
            default: false
        },
     }],
     isActive:{
        type:Boolean,
        default: true,
     }


})


const userModel = mongoose.model('user', userSchema);

module.exports = userModel;




