const UserDB = require('../model/user');
const RouletteDB = require('../model/roulette');


class Play{
    
    static roulettePage(req,res){
        res.render('roulette');
    }

    static rouletteTimer(){
        
    }

    static rouletteSaveGame(req,res){
        const rouletteID = req.body['details[rouletteID]'];
        const players = req.body['details[players]'];
        const winningNumber = req.body['details[winningNumber]'];
        const winningColor = req.body['details[winningColor]'];

        if(rouletteID && winningColor && winningColor){
            let newRouletteGame = new RouletteDB({
                rouletteID: rouletteID,
                players: players || null,
                winningNumber: winningNumber,
                winningColor: winningColor
            });

            newRouletteGame.save();
        }
    }
    static rouletteBet(req,res){
        const user = req.user;
        const amount = parseInt(req.body['details[amount]']);
        
        const savePoll = req.body['details[savePoll]'];
        const players = req.body['details[players][1][id]'];
        const winningNumber = req.body['details[savePoll]'];
        const winningcolor = req.body['details[winningColor]'];
        if(savePoll){
            res.send('smth');
        }
        else if(isNaN(amount)){
            res.json({message:'Not a number', error: true});
        }
        else{
            if(user){
                UserDB.findOne({_id: user._id}, function(err,user){
                    if(err) return res.json({message: err, error: true});
                    else if(!user) return res.json({message: 'Cannot find user', error: true});
                    else if(user.balance < amount) res.json({message: 'You do not have enough money', error: true});
                    else {
                        user.balance -= amount;
                        user.save(function(err){
                            if(err) return res.json({message: err, error: true});
                            else return res.json({message: 'Bet placed', user: req.user,error: false});
                        });
                    }
                });
            }
            else{
                return res.json({message: 'You are not logged in', error: true});
            }
        }
    }
}

module.exports = Play;