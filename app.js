// NPMs
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressSession = require('express-session');
const expressValidator = require('express-validator');

const app = express();

//DBs
const rouletteDB = require('./model/roulette');
const userDB = require('./model/user');

// Server
var server = app.listen(3000);
// Socket.io
const io = require('socket.io')(server);

// Require routers
const indexRouter = require('./routes/index');
const RouletteController = require('./Controller/Roulette');

// Local-login
require("./passport-config/local");

// Express middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());
app.use(expressSession({secret:"everythingistopsecret", saveUninitialized:false, resave:false}));
app.use(cookieParser("everythingistopsecret"));
app.use(passport.initialize());
app.use(passport.session());

let user;
//Locals //
app.use(function(req,res,next){
    app.locals.user = req.user;
    user = req.user;
    next();
});

// Timer
let rouletteID = 0;
let timer = 16;
let activePlayers = [];
let timerMessage;

let winningNumber;
let winningColor;

let rouletteSaving;

let sockets = [];

function chooseNumber(){
    winningNumber = Math.floor(Math.random()*14);

    if(winningNumber == 0) winningColor = 'green';
    else if(winningNumber < 8 && winningNumber > 0) winningColor = 'red';
    else if(winningNumber > 7 && winningNumber < 15) winningColor = 'black';
    timerMessage = 'Rolling';

    sockets.forEach(function(socket){
        socket.emit('winningNumber', {winningNumber:winningNumber});
    });

}

function clearData(){
    timer = 16;
    activePlayers = [];

}

function EndOfTurn(){

    rouletteSaving = new rouletteDB({
        rouletteID: rouletteID,
        players: activePlayers,
        winningNumber: winningNumber,
        winningColor: winningColor
    });

    rouletteSaving.save(function(err){
        if(err) console.log(err);
    });

    if(activePlayers.length>0){
        activePlayers.forEach(function(player){
            if(player.choosenColor == winningColor){
                userDB.findOne({_id:player.userID}, function(err,user){
                    if(winningColor == 'red' || winningColor == 'black') user.balance += player.amount*2; 
                    else if(winningColor == 'green') user.balance += player.amount*14;
                    user.save();
                });
            }
            clearData();
        });
    }
    else{
        clearData();
    }
    

    rouletteID++;
}

function handleInterval(){
    if(timer>0) timerMessage = 'Time left:'+timer;
    if(timer == -10) EndOfTurn();
    else if(timer == -5) timerMessage = 'Winning number: '+winningNumber;
    else if(timer == 0) chooseNumber();
    sockets.forEach(function(socket){
        socket.emit('sendData', {timer:timer, timerMessage:timerMessage});
    });
    timer--;
}
handleInterval();
setInterval(handleInterval,1000);

var myRoulette = io.of('/my-roulette');
myRoulette.on('connect', function (socket) {
    sockets.push(socket);

    socket.emit('getPlayers', {activePlayers:activePlayers});

    socket.on('bet', function(data){
        if(timer>0){
            userDB.findOne({_id:user._id}, function(err,user){
                if(err) console.log(err);
                else if(user.balance<data.amount) console.log("Not enough money");
                else if(user && user.balance>=data.amount){
                    let newPlayer = {
                        userID: user.id,
                        username: user.username,
                        amount: data.amount,
                        choosenColor: data.choosenColor
                    }
                    activePlayers.push(newPlayer);
                    user.balance -= data.amount;
                    user.save(function(err){
                        if(err) console.log(err);
                        socket.emit('sendPlayer', {newPlayer:newPlayer});
                    });
                }
            });
        }
    });
});

         
//Routes
app.use('/', indexRouter);