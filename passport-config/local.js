const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const UserDB = require('../model/user');

passport.serializeUser(function(user, done){
    done(null,user.id);
});

passport.deserializeUser(function(id, done){
    UserDB.findById(id, function(err, user){
        done(err, user);
    });
});

passport.use('local-login',new LocalStrategy(
    function(username, password, done) {

    const usernameRegExp = new RegExp('^'+username+'$', 'i');

    UserDB.findOne({ username: usernameRegExp }, function (err, user) {
        if (err) return done(err);
        if (!user) return done(null, false); 
        UserDB.comparePasswords(password, user.password, function(err,isMatch){
            if(err) return done(err);
            if(!isMatch) return done(null,false);
            else return done(null, user);
        })
    });
    }
));