const express = require('express');

const userRouter = require('./user');
const playRouter = require('./play');

const router = express.Router();

router.get('/', (req,res)=>{
    res.render('index');
});

router.use('/user' , userRouter);
router.use('/play', playRouter);

function isLogged(req,res,next){
    if(req.user) next();
    else res.redirect('/user/login');
}

module.exports = router;