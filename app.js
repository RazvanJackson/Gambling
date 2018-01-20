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
const diceDB = require('./model/dice');
const userDB = require('./model/user');

// Server
var server = app.listen(3000);
// Socket.io
global.io = require('socket.io')(server);

// Require routers
const indexRouter = require('./routes/index');
const RouletteController = require('./Controller/Roulette');
const DiceController = require('./Controller/Dice');

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

global.user;
//Locals
app.use(function(req,res,next){
    app.locals.user = req.user;
    user = req.user;
    next();
});

//Games
RouletteController.CountDown();
DiceController.Play();

//IO
const indexDetails = io.of('/index-details');

indexDetails.on('connect', function(socket){
    let rouletteTotalPlayers = [];
    let rouletteTotalWagered = 0;

    let diceTotalPlayers = [];
    let diceTotalWagered = 0;
    
    rouletteDB.find({}, function(err,games){
        if(!err){
            games.forEach(function(game){
                game.players.forEach(function(player){
                    if(!rouletteTotalPlayers.includes(player.username)) rouletteTotalPlayers.push(player.username);
                    player.bets.forEach(function(bet){
                        rouletteTotalWagered += bet.amount;
                    })
                });
            });
            socket.emit('sendRouletteData', {totalPlayers:rouletteTotalPlayers, totalWagered: rouletteTotalWagered});
        }
    });

    diceDB.find({}, function(err,games){
        if(!err){
            games.forEach(function(game){
                if(!diceTotalPlayers.includes(game.player.username)) diceTotalPlayers.push(game.player.username);
                diceTotalWagered += parseInt(game.player.amount);
            });
        }
        socket.emit('sendDiceData', {totalPlayers:diceTotalPlayers, totalWagered: diceTotalWagered});
    });
});

   


//Routes
app.use('/', indexRouter);

