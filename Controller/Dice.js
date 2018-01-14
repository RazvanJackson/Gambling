const userDB = require('../model/user');
const diceDB = require('../model/dice');

class dice{
    static dicePage(req,res){
        res.render('dice');
    }

    static Play(){
        const mydice = io.of('my-dice');
        mydice.on('connect', function(socket){
                socket.on('bet', function(data){
                    diceDB.find({}, function(err,dice){
                        let diceID = dice.length;
                        if(user){
                            let numbers = [1,2,3,4,5,6];
                            let winningNumber = Math.floor(Math.random()*6 + 1);
                            let message = 'Dice rolls '+ winningNumber;
                            
                            let newdice = new diceDB({
                                diceID: diceID,
                                player: {
                                    userID: user.id,
                                    username: user.username,
                                    option: data.option,
                                    amount: data.amount
                                },
                                winningNumber: winningNumber
                            });
                            newdice.save(function(){
                                socket.emit('message', message);
                            });

                        userDB.findOne({_id:user._id}, function(err,user){
                            let amount = parseInt(data.amount);
                            if(err) console.log('Not found');
                            else{
                                if(data.option == 'low' && winningNumber < 4) user.balance += amount;
                                else if(data.option == 'high' && winningNumber > 3) user.balance +=amount;
                                else if(numbers.includes(parseInt(data.option)) && data.option == winningNumber) user.balance +=amount*5;
                                else user.balance -= amount;
                                user.save();
                            }
                        });
                    }
                });
            });
        });
    }
}

module.exports = dice;