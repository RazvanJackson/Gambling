const express = require('express');
const passport =require('passport');

const UserController = require('../Controller/User');

const router = express.Router();

router.get('/login', UserController.loginPage);
router.get('/signup', UserController.signupPage);
router.get('/myaccount', UserController.myaccountPage);

router.post('/login-validation',express.urlencoded({extended:false}), UserController.loginVerification);
router.post('/login', express.urlencoded({extended:false}), passport.authenticate('local-login', {
    successRedirect : "/",
    failureRedirect: "/user/login",
}), function(req,res){
    res.send('yeah');
});

router.get('/logout', UserController.logout);
router.post('/signup', express.urlencoded({extended:false}), UserController.signupForm);
router.post('/update-validation', express.urlencoded({extended:false}), UserController.updateVerification);
router.post('/update', express.urlencoded({extended:false}), UserController.update);
router.post('/get-history', express.urlencoded({extended:false}), UserController.getHistory);
module.exports = router;