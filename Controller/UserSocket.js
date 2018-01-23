module.exports = function(user){
    var userIO = io.of('user-details');

    userIO.on('connect', function(socket){
        if(user != undefined){
            socket.emit('sendPlayer', {username: user.username, balance: user.balance});
        }
        else{
            socket.emit('sendPlayer', null);
        }
    });


}