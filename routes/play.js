const express = require('express');

const RouletteController = require('../Controller/Roulette');
const DicesController = require('../Controller/Dices');

const router = express.Router();

router.get('/roulette', RouletteController.roulettePage);
router.get('/dices', DicesController.dicesPage);



module.exports = router;