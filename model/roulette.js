const mongoose = require('mongoose');

var db = mongoose.createConnection('mongodb://admin:admin@ds249005.mlab.com:49005/gambling');


const rouletteSchema = mongoose.Schema({
    rouletteID:{
        type: Number,
        required: true
    },

    players:{
       type:[]
    },

    winningNumber:{
        type:Number,
        required: true
    },

    winningColor:{
        type:String,
        required: true
    },

    date : {
        type: Date,
        default : Date.now()
    }
});

const Roulette = db.model('roulette', rouletteSchema, 'roulette');
module.exports = Roulette;