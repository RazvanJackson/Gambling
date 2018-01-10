const userDB = require('../model/user');
const dicesDB = require('../model/dices');

class Dices{
    static dicesPage(req,res){
        res.render('dices');
    }

    static Play(){
        let dicesID;
        dicesDB.find({}, function(err,data){
            dicesID = data.length;
        });

        const myDices = io.of('my-dices');
        myDices.on('connect', function(socket){
            socket.on('bet', function(data){
                if(user){
                    let numbers = [1,2,3,4,5,6];
                    let winningNumber = Math.floor(Math.random()*6 + 1);
                    let message = 'Dice rolls '+ winningNumber;
                    
                    let newDices = new dicesDB({
                        dicesID: dicesID,
                        player: {
                            userID: user.id,
                            username: user.username,
                            option: data.option,
                            amount: data.amount
                        },
                        winningNumber: winningNumber
                    });
                    newDices.save();

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
    }
}

module.exports = Dices;