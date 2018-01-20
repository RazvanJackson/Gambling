const userDB = require('../model/user');
const rouletteDB = require('../model/roulette');

let rouletteID;
let timer = 16;
let timerMessage;

let bets = [];
let players = [];

let winningNumber;
let winningColor;

let rouletteSaving;

rouletteDB.find({}, function(err,data){
    rouletteID = data.length;
});

let myRoulette = io.of('/my-roulette');

myRoulette.on('connect', function (socket) {
    socket.emit('getBets', {bets:bets});
});

class Roulette{
    static roulettePage(req,res){
        res.render('roulette');
    }

    static CountDown(){
        function chooseNumber(){
            winningNumber = Math.floor(Math.random()*15);

            if(winningNumber == 0) winningColor = 'green';
            else if(winningNumber < 8 && winningNumber > 0) winningColor = 'red';
            else if(winningNumber > 7 && winningNumber < 15) winningColor = 'black';
            timerMessage = 'Rolling';

            myRoulette.emit('winningNumber', {winningNumber:winningNumber});

        }

        function clearData(){
            timer = 15;
            bets = [];
        }

        function EndOfTurn(){

            rouletteSaving = new rouletteDB({
                rouletteID: rouletteID,
                players: players,
                winningNumber: winningNumber,
                winningColor: winningColor
            });

            rouletteSaving.save(function(err){
                if(err) console.log(err);
                players = [];
            });

            if(players.length>0){
                players.forEach(function(player){
                    player.bets.forEach(function(bet){
                        if(bet.choosenColor == winningColor){
                            userDB.findOne({_id:player.id}, function(err,user){
                                if(winningColor == 'red' || winningColor == 'black'){
                                    user.balance += bet.amount*2; 
                                    user.save();
                                } 
                                else if(winningColor == 'green'){
                                    user.balance += bet.amount*14;
                                    user.save();
                                }
                            });
                        }
                    });
                });
                clearData();
            }
            else{
                clearData();
            }
            

            rouletteID++;
        }

        function Timer(){
            if(timer>0) timerMessage = 'Time left:'+timer;
                if(timer == -10) EndOfTurn();
                else if(timer == -5) timerMessage = 'Winning number: '+winningNumber;
                else if(timer == 0) chooseNumber();
                myRoulette.emit('sendData', {timer:timer, timerMessage:timerMessage});
            timer --;
        }
        Timer();
        setInterval(Timer,1000);
    }

    static Play(req,res){
        let choosenColor = req.body.choosenColor;
        let amount = req.body.amount;
        let user = req.user;

        if(timer>0 && amount>0){
            userDB.findOne({_id:user._id}, function(err,user){
                if(err) console.log(err);
                else if(user && user.balance>=amount){
                    let newBet = {
                        username: user.username,
                        amount: amount,
                        choosenColor: choosenColor
                    }
                    bets.push(newBet);
                    user.balance -= amount;
                    user.save(function(err){
                        if(err) console.log(err);
                        else myRoulette.emit('sendBet', {newBet:newBet});
                    });
                }
            });
            if(players.length > 0){
                    if(players.filter(function(player){return player.username == user.username}).length > 0){
                        players.forEach(function(player){
                                if(player.bets.filter(function(bet){return bet.choosenColor == choosenColor}).length > 0){
                                    player.bets.forEach(function(bet){
                                        if(bet.choosenColor == choosenColor) bet.amount += parseInt(amount);
                                    });
                                }
                                else player.bets.push({
                                    choosenColor:choosenColor,
                                    amount: parseInt(amount)
                                });
                        });
                    }
                    else{
                        players.push({
                            id:user.id,
                            username:user.username,
                            bets:[{
                                choosenColor: choosenColor,
                                amount: parseInt(amount)
                            }]
                        });
                    }
            }
            else {
                players.push({
                    id:user.id,
                    username:user.username,
                    bets:[{
                        choosenColor: choosenColor,
                        amount: parseInt(amount)
                    }]
                });
            }
            res.json({username:req.user.username});
        }
        

       
    }
}

module.exports = Roulette;