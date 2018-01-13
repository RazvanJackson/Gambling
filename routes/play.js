const express = require('express');

const RouletteController = require('../Controller/Roulette');
const DiceController = require('../Controller/Dice');

const router = express.Router();

router.get('/roulette', RouletteController.roulettePage);
router.post('/roulette', express.urlencoded({extended:false}),RouletteController.Play);
router.get('/dice', DiceController.dicePage);



module.exports = router;