const mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://admin:admin@ds249005.mlab.com:49005/gambling');

const userSchema = mongoose.Schema({
    email : {
        type: String,
        required: true
    },

    username : {
        type: String,
        required: true
    },

    password : {
        type: String,
        required: true
    },

    balance : {
        type: Number,
        required: true
    },
    
    date : {
        type: Date,
        default : Date.now()
    }
});

const User = db.model('user', userSchema, 'users');
module.exports = User;