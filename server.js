var express = require('express');
var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

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

io.on('connection', function(socket){
  socket.on('chat message', function(msg){
    io.emit('chat message', msg);
  });
});

app.use(express.static("client"));
//app.use(express.static("server"));

http.listen(3000, function(){
  console.log('listening on *:3000');
});

exports = module.exports = app;
