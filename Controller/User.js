const SignupValidation = require('./SignupValidation');

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

    static loginForm(req,res, next){
        
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
}

module.exports = User;