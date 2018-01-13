const SignupValidation = require('./SignupValidation');
const LoginValidation = require('./LoginValidation');
const UpdateValidation = require('./UpdateValidation');
const GamesHistory = require('./GamesHistory');

const rouletteDB = require('../model/roulette');

const passport = require('passport');

class User{
    static loginPage(req,res){
        res.render('login');
    }

    static signupPage(req,res){
        res.render('signup');
    }

    static myaccountPage(req,res){
        
        res.render('myaccount');
    }

    static logout(req,res){
            req.logOut();
            res.redirect('/');
    }

    static loginVerification(req,res){
        LoginValidation.match(req,res);
    }

    static signupForm(req,res){
        const email = req.body.email;
        const username = req.body.username;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(email && username==undefined && password ==undefined && confirmpassword==undefined){
            SignupValidation.emailValidation(req,res,function(){
                return res;
            });
        }        
       
        if(username && email==undefined && password ==undefined && confirmpassword==undefined){
            SignupValidation.usernameValidation(req,res,function(){
                return res;
            });
        }

        else if(confirmpassword && password && username==undefined && email == undefined){
            SignupValidation.confirmPasswordValidation(req,res,function(){
                return res;
            });
        }
        
        if(email && username && password && confirmpassword){
            SignupValidation.checkAll(req,res);
        }
    }

    static updateVerification(req,res){
        const email = req.body.email;
        const password = req.body.password;
        const confirmpassword = req.body.confirmpassword;

        if(email){
            UpdateValidation.emailValidation(req,res,function(){
                return res;
            });
        }        
       
        else if(confirmpassword || password){
            UpdateValidation.confirmPasswordValidation(req,res,function(){
                return res;
            });
        }
    }

    static update(req,res){
        UpdateValidation.checkAll(req,res);
    }

    static getHistory(req,res){
        let history = req.body.history;
        let user = req.user;

        if(history == 'Roulette'){
            GamesHistory.rouletteHistory(user,function(data){
                res.send(data);
            });
        } 
        else if(history == 'Dice'){
            GamesHistory.diceHistory(user,function(data){
                res.send(data);
            });
        } 
        else if(history == 'Versus'){
            GamesHistory.versusHistory(user,function(data){
                res.send(data);
            });
        } 
    }
}

module.exports = User;