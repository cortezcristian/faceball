var parent = module.parent.exports 
  , app = parent.app
  , server = parent.server
  , config = parent.config
  , User = require('./models/users.js') 
  , mongooseSessionStore = parent.SessionStore
  , express = require('express')
  , parseSignedCookie = require('connect').utils.parseSignedCookie
  , cookie = require('cookie')
  , sio = require('socket.io');


var io = sio.listen(server);

io.configure(function() {
  io.enable('browser client minification');
  io.enable('browser client gzip');
  //node js socketio Unexpected response code: 502
  // http://stackoverflow.com/questions/12569451/unexpected-response-code-502-error-when-using-socket-io-with-appfog
  io.set('transports', ['xhr-polling']);
  //Clear sessions when server starts
  //mongooseSessionStore.clear();
/*
  io.set('authorization', function (data, callback) {
        if(data.headers.cookie) {
            // save parsedSessionId to handshakeData
            data.cookie = cookie.parse(data.headers.cookie);
            data.sessionId = parseSignedCookie(data.cookie['connect.sid'], config.session.secret);
        }
        callback(null, true);
    });
*/
});

var Game = {
    score: {
      blue: 0,  
      red : 0  
    },
    canvas: {
        ball: {},
        players: [
        ]    
    }    
};

//console.log(mongooseSessionStore);

io.sockets.on('connection', function (socket) {
    var sessionId    = socket.handshake.sessionId; //access to the saved data.sessionId on auth

    /**
     * Game Functionality
     */
    socket.on('joinGame', function (data) {
        var exists = false;
        //to all sockets
        Game.canvas.players.forEach(function(v,i){
            if(v.name == data.name){
                exists = true;
            }     
        });
        if(!exists){
            Game.canvas.players.push(data);
            console.log("----->",data);
            //io.sockets.emit('joinedPlayer');
            socket.emit('joined', data);
            io.sockets.emit('drawCanvas', Game);
        }
    });

    socket.on('askCanvas', function(data){
        socket.emit('drawCanvas', Game);
    });

    socket.on('move', function(data){
        //Find Player, Update Coords
        console.log(">>>>>>",data);
        Game.canvas.players.forEach(function(v,i){
            console.log(v);
            if(v.name == data.name){
                console.log("entra")
                Game.canvas.players[i].x = data.x;    
                Game.canvas.players[i].y = data.y;    
            }     
        });
        io.sockets.emit('drawCanvas', Game);
    });

    socket.on('collisionWith', function(data){
        console.log(">>>>",data);
        if(data.wall){
            var x = parseInt(data.x),
                y = parseInt(data.y),
                halfArco = 40,
                height = 300;
                width = 578;
           if(x<=0&&y>=(height/2-halfArco)&&y<=(height/2+halfArco)){
               Game.score.blue++;
               io.sockets.emit('updateScore', Game.score);
           }  

           if(x>=width&&y>=(height/2-halfArco)&&y<=(height/2+halfArco)){
               Game.score.red++;
               io.sockets.emit('updateScore', Game.score);
           }  
        }
        io.sockets.emit('updateBall', data);
    });

    /**
     * Chat Functionality
     */
    socket.on('joinRoom', function (room) {
        socket.set('room', room, function() { console.log('room ' + room + ' saved'); } );
        socket.username = room;
        socket.join(room);
        User.login(socket.username);
        //to all sockets
	    io.sockets.emit('joinedUser', socket.username);
    });

    socket.on('sendChat', function(data){
	    //socket.broadcast.to("room_"+user["_id"]).emit('challenge request', {userChallenging:socket.handshake.userData});
        console.log(data);
        //console.log(socket);
	    socket.broadcast.to(data.user).emit('chatIn', socket.username, data);
        //io.sockets.emit('chatIn', socket.username, data);
	    //socket.broadcast.emit('chatIn', {msg:data.msg});
    });

    socket.on('askUserList', function(data){
        User.find({online:true}, function(err, list){
            socket.emit('receiveUserList', list);
        });
    });

    socket.on('disconnect', function () {
        console.log("Disconnected "+socket.username);                                                                                                                     
        console.log("Sockets in room "+io.sockets.clients(socket.username).length)
        if(io.sockets.clients(socket.username).length==1){
            //Update Status in DB
            User.logout(socket.username);
        }   
        //to all sockets
        io.sockets.emit('logoutUser', socket.username);

    });
});
