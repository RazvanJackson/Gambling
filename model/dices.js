const mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://admin:admin@ds249005.mlab.com:49005/gambling');


const dicesSchema = mongoose.Schema({
    dicesID:{
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

const Dices = db.model('dices', dicesSchema, 'dices');
module.exports = Dices;