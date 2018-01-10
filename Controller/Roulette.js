const userDB = require('../model/user');
const rouletteDB = require('../model/roulette');


class Roulette{
    
    static roulettePage(req,res){
        res.render('roulette');
    }


    static Play(){
        let rouletteID;
        rouletteDB.find({}, function(err,data){
            rouletteID = data.length;
        });

        let timer = 16;
        let timerMessage;

        let bets = [];
        let players = [];

        let winningNumber;
        let winningColor;

        let rouletteSaving;

        let sockets = [];

        function chooseNumber(){
            winningNumber = Math.floor(Math.random()*15);

            if(winningNumber == 0) winningColor = 'green';
            else if(winningNumber < 8 && winningNumber > 0) winningColor = 'red';
            else if(winningNumber > 7 && winningNumber < 15) winningColor = 'black';
            timerMessage = 'Rolling';

            sockets.forEach(function(socket){
                socket.emit('winningNumber', {winningNumber:winningNumber});
            });

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
            timer --;
        }
        Timer();
        setInterval(Timer,1000);

        var myRoulette = io.of('/my-roulette');

        myRoulette.on('connect', function (socket) {

            function sendData(){
                    myRoulette.emit('sendData', {timer:timer, timerMessage:timerMessage});
            }
            sendData();
            setInterval(sendData,1000);

            sockets.push(socket);
            socket.emit('getBets', {bets:bets});

            socket.on('bet', function(data){
                if(timer>0 && data.amount>0){
                    userDB.findOne({_id:user._id}, function(err,user){
                        if(err) console.log(err);
                        else if(user && user.balance>=data.amount){
                            let newBet = {
                                userID: user.id,
                                username: user.username,
                                amount: data.amount,
                                choosenColor: data.choosenColor
                            }
                            bets.push(newBet);
                            user.balance -= data.amount;
                            user.save(function(err){
                                if(err) console.log(err);
                                else myRoulette.emit('sendBet', {newBet:newBet});
                            });
                        }
                    });
                    if(players.length > 0){
                            if(players.filter(function(player){return player.username == user.username}).length > 0){
                                players.forEach(function(player){
                                        if(player.bets.filter(function(bet){return bet.choosenColor == data.choosenColor}).length > 0){
                                            player.bets.forEach(function(bet){
                                                if(bet.choosenColor == data.choosenColor) bet.amount += parseInt(data.amount);
                                            });
                                        }
                                        else player.bets.push({
                                            choosenColor:data.choosenColor,
                                            amount: parseInt(data.amount)
                                        });
                                });
                            }
                            else{
                                players.push({
                                    id:user.id,
                                    username:user.username,
                                    bets:[{
                                        choosenColor: data.choosenColor,
                                        amount: parseInt(data.amount)
                                    }]
                                });
                            }
                    }
                    else {
                        players.push({
                            id:user.id,
                            username:user.username,
                            bets:[{
                                choosenColor: data.choosenColor,
                                amount: parseInt(data.amount)
                            }]
                        });
                    }
                }
            });
        });
    }
}

module.exports = Roulette;