const rouletteDB = require('../model/roulette');
const diceDB = require('../model/dice');
const userDB = require('../model/user');

module.exports = function(){
    // Socket IO for Index
    const indexIO = io.of('/index-details');

    indexIO.on('connect', function(socket){
    let rouletteTotalPlayers = [];
    let rouletteTotalWagered = 0;

    let diceTotalPlayers = [];
    let diceTotalWagered = 0;
    
    rouletteDB.find({}, function(err,games){
        if(!err){
            games.forEach(function(game){
                game.players.forEach(function(player){
                    if(!rouletteTotalPlayers.includes(player.username)) rouletteTotalPlayers.push(player.username);
                    player.bets.forEach(function(bet){
                        rouletteTotalWagered += bet.amount;
                    })
                });
            });
            socket.emit('sendRouletteData', {totalPlayers:rouletteTotalPlayers, totalWagered: rouletteTotalWagered});
        }
    });

    diceDB.find({}, function(err,games){
        if(!err){
            games.forEach(function(game){
                if(!diceTotalPlayers.includes(game.player.username)) diceTotalPlayers.push(game.player.username);
                diceTotalWagered += parseInt(game.player.amount);
            });
        }
        socket.emit('sendDiceData', {totalPlayers:diceTotalPlayers, totalWagered: diceTotalWagered});
    });
});
}