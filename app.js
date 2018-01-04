// NPMs
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressSession = require('express-session');
const expressValidator = require('express-validator');

const app = express();

// Server
const server = require('http').createServer(app);

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

//Locals //
var user;
app.use(function(req,res,next){
    app.locals.user = req.user;
    user = req.user;
    next();
});

// Timer
var myRoulette = io.of('/my-roulette');

let timer = 15;
let activePlayers = [];
let timerMessage;

function chooseNumber(){
    let winningNumber = Math.floor(Math.random()*14);
    timerMessage = 'Winning number:' + winningNumber;
}

function clearTimer(){
    timer = 15;
    activePlayers = [];
}

function handleInterval(){
    if(timer>0) timerMessage = 'Time left:'+timer;
    if(timer == -10) clearTimer();
    else if(timer == -5) chooseNumber();
    else if(timer == 0) timerMessage = 'Rolling';
    io.emit('sendData',{timer:timer, timerMessage:timerMessage});
    timer --;
}



    myRoulette.on('connect', function(socket) {
        socket.on('bet', function(data) {
          console.log(data);
        });
      });
var interval = setInterval(handleInterval,1000);
//Routes
app.use('/', indexRouter);

server.listen(3000, function(){
    myRoulette.emit('connection');
});