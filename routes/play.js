const express = require('express');

const RouletteController = require('../Controller/Roulette');

const router = express.Router();

router.get('/roulette', RouletteController.roulettePage);



module.exports = router;