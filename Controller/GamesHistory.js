const rouletteDB = require('../model/roulette');
const diceDB = require('../model/dice');

class GamesHistory{
    static rouletteHistory(user,callback){
        let username = user.username;
        rouletteDB.find({players : {$elemMatch: {username:username}}}, function(err,bets){
            if(err) return callback({error:true, message:"System error"})
            else if(bets) return callback(bets);
            else if(!bets) return callback({error:false, message:"No bets"});
        }).sort({'rouletteID': -1}).limit(10);
       
    }
    static diceHistory(user,callback){
        let username = user.username;
        diceDB.find({'player.username' : username}, function(err,bets){
            if(err) return callback({error:true, message:"System error"})
            else if(bets) return callback(bets);
            else if(!bets) return callback({error:false, message:"No bets"});
        }).sort({'diceID': -1}).limit(10);
    }
    static versusHistory(user,callback){
    }
}

module.exports = GamesHistory;