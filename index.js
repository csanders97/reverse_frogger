var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io').listen(http);
var PORT = process.env.PORT || 3000;

var players = 0;
var playersArr = [];
var currentPosX = 150;
var currentPosY = 200;
var currentPosX2 = 600;
var currentPosY2 = 800;

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/app/index.html');
});

app.use(express.static('app'));

io.on('connection', function(socket) {
    if(players >= 2) {
        socket.emit('tooMany');
        socket.disconnect();
    } else {
        players++;
        socket.broadcast.emit('newJoin', "Player " + players);
        playersArr.push(socket.id);
        if(playersArr.length == 3) {
            socket.id = "Player 1";
        } else {
            socket.id = "Player " + players;
        }

        io.emit('players2', players);
        console.log(socket.id + ' connected. ' + players + " players in room.");
        
        socket.broadcast.emit('updatePlayers', players, playersArr);

        socket.on('playerMove', function(startX, startY, moveX, moveY, p2X, p2Y) {
            if (socket.id == "Player 1") {
                currentPosX = moveX;
                currentPosY = moveY;
                io.emit('updatePosition', startX, startY, moveX, moveY, socket.id);
            } else {
                currentPosX2 = moveX;
                currentPosY2 = moveY;
                io.emit('updatePosition', p2X, p2Y, moveX, moveY, socket.id);
            }
        });

        socket.on('playerReset', function() {
            io.emit('updatePositionP1', 20, 180);
            io.emit('updatePositionP2', 600, 800);
        });

        socket.emit('new', currentPosX, currentPosY, currentPosX2, currentPosY2);

        socket.on('disconnect', function() {
            players--;
            var index = playersArr.indexOf(socket.id);
            if (index !== -1) playersArr.splice(index, 1);
            socket.broadcast.emit('left', socket.id);
            socket.broadcast.emit('updatePlayers', players, playersArr);
        });
    }
});

http.listen(PORT, function() {
	console.log('listening on localhost:3000');
});