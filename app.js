// NPMs
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const expressSession = require('express-session');
const expressValidator = require('express-validator');

const app = express();


// Server
var server = app.listen(3000);
// Socket.io
global.io = require('socket.io')(server);
var userIO = require('./Controller/UserSocket');
require('./Controller/Sockets')();

// Local-login
require("./passport-config/local");

//Routes

const indexRouter = require('./routes/index');

// Express middlewares
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, "public")));
app.use(expressValidator());
app.use(expressSession({secret:"everythingistopsecret", saveUninitialized:false, resave:false}));
app.use(cookieParser("everythingistopsecret"));
app.use(passport.initialize());
app.use(passport.session());

//Locals
app.use(function(req,res,next){
    app.locals.user = req.user;

    userIO(req.user);
    
    next();
});

//Games
const RouletteController = require('./Controller/Roulette');
const DiceController = require('./Controller/Dice');

RouletteController.CountDown();
DiceController.Play();

//Routes
app.use('/', indexRouter);

