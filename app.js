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
global.io = require('socket.io')(server);

// Require routers
const indexRouter = require('./routes/index');
const RouletteController = require('./Controller/Roulette');
const DicesController = require('./Controller/Dices');


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
//Locals //
app.use(function(req,res,next){
    app.locals.user = req.user;
    user = req.user;
    next();
});

//games
RouletteController.CountDown();
DicesController.Play();

//Routes
app.use('/', indexRouter);

