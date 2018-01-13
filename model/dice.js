const mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://admin:admin@ds249005.mlab.com:49005/gambling');


const diceSchema = mongoose.Schema({
    diceID:{
        type: Number,
        required: true
    },

    player:{
        type: Object,
        required: true
    },

    winningNumber:{
        type:Number,
        required: true
    },

    date : {
        type: Date,
        default : Date.now()
    }
});

const Dice = db.model('dice', diceSchema, 'dice');
module.exports = Dice;