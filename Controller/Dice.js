const userDB = require('../model/user');
const diceDB = require('../model/dice');

class dice{
    static dicePage(req,res){
        res.render('dice');
    }

    static Play(){
        const mydice = io.of('my-dice');
        mydice.on('connect', function(socket){
            let diceID;
            diceDB.find({}, function(err,data){
                diceID = data.length;
                socket.on('bet', function(data){
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
                        newdice.save();

                        userDB.findOne({_id:user._id}, function(err,user){
                            let amount = parseInt(data.amount);
                            if(err) console.log('Not found');
                            else{
                                if(data.option == 'low' && winningNumber < 4) user.balance += amount;
                                else if(data.option == 'high' && winningNumber > 3) user.balance +=amount;
                                else if(numbers.includes(data.option) && data.option == winningNumber) user.balance +=amount*5;
                                else user.balance -= amount;
                                user.save();
                                socket.emit('message', message);
                            }
                        });
                    }
                });
            });
        });
    }
}

module.exports = dice;