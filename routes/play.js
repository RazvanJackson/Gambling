const express = require('express');

const RouletteController = require('../Controller/Roulette');

const router = express.Router();

router.get('/roulette', RouletteController.roulettePage);
router.post('/roulette',express.urlencoded({extended:false}),express.json(), RouletteController.rouletteBet);
router.post('/roulette-save-game',express.urlencoded({extended:false}),express.json(), RouletteController.rouletteSaveGame);



module.exports = router;