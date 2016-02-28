var express = require('express');
var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var _ = require("lodash");
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
var services = require('./server/models/services');

// Load the iniparser module
var iniparser = require('iniparser');
// Read the ini file and populate the content on the config object
//var config = iniparser.parseSync('./server/config/config.ini');
var config = iniparser.parseSync('./server/config/config.ini');

// Connect to MongoDB
mongoose.connect(config.mongouri);
mongoose.connection.on('error', function(err) {
  console.error('MongoDB connection error: ' + err);
  process.exit(-1);
});

var bodyParser = require('body-parser');

// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

require('./routes')(app);



app.get('/', function(req, res){
  res.sendFile(__dirname + '/index.html');
});

app.get('/chat', function(req, res){
  res.sendFile(__dirname + '/client/index.html');
});

//response.status(200).json({ message: "Message received" });
    io.on("connection", function(socket) {
        console.log("socket io: connectio inside");
        socket.on("new_user", function(data) {
            console.log("new_user: connectio inside server"+data);
			services.messagesRooms().push({ 
			        users: data.user._id,
			        messages: []
			    });
            var username;
            if(data != null && data.user != null)
                username = data.user.username
            var newName =  username;
            services.participants().push({ id: data.user._id, username: username });
            //console.log(participants);
            io.sockets.emit("new_connection", {
            user: {
                id: data.user._id,
                name: newName
            },
            sender:"system",
            created_at: new Date().toISOString(),
            participants: services.participants
            });
        });
    });
    
app.post("/messages/", function(request, response) {
  var message = request.body.message;
  var idUser1 = request.body.idUser1;
  var idUser2 = request.body.idUser2;
  
  if(message && message.trim().length > 0) {
    var user_id    = request.body.user_id;
    var created_at = request.body.created_at;
    var user       = _.find(services.participants(), { id: user_id });

    var messagesRoom = services.messagesRooms();
    var room = [];
    for(var i = 0; i<messagesRoom.length; i++ ){
		console.log(messagesRoom[i].users);
        if(messagesRoom[i].users.indexOf(idUser1) != -1 && messagesRoom[i].users.indexOf(idUser2) != -1){  
            room = messagesRoom[i];
        }
    }
    // let our chatroom know there was a new message
    io.sockets.emit("incoming_message", { message: message, user: user, created_at: created_at });
    response.status(200).json({ message: "Message received" });
    
  } else {
    return response.json(400, { error: "Invalid message" });
  }
})

app.use(express.static("client"));
//app.use(express.static("server"));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

exports = module.exports = app;
