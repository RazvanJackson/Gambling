const express = require('express');
const passport =require('passport');

const UserController = require('../Controller/User');

const router = express.Router();

router.get('/login', UserController.loginPage);
router.get('/signup', UserController.signupPage);
router.get('/myaccount', UserController.myaccountPage);

router.post('/login', express.urlencoded({extended:false}), passport.authenticate('local-login', {
    successRedirect : "/",
    failureRedirect: "/user/login",
}));

router.get('/logout', UserController.logout);
router.post('/signup', express.urlencoded({extended:false}), UserController.signupForm);

module.exports = router;