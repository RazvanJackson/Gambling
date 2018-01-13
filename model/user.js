const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

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

userSchema.statics.hashPassword = function(password, callback){
    bcrypt.genSalt(function(err,salt){
        if(err) return callback();
        else {
            bcrypt.hash(password, salt, function(err,hash){
                if(err) return callback();
                else return callback(hash);
            });
        }
    })
}

userSchema.statics.comparePasswords = function(guess, password, callback){
    bcrypt.compare(guess, password, function(err, isMatch) {
        return callback(err, isMatch);
      });
}

const User = db.model('user', userSchema, 'users');
module.exports = User;