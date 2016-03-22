var _ = require("lodash");
var express = require('express');
var app = express(); 
var http = require('http').Server(app);
var io = require('socket.io')(http);
var services = require('../../models/services');

var nameCounter  = 1;

module.exports.initRooms = function(request, response) {
	services.initRooms(request, response);
	
}

module.exports.messages = function(request, response) {
 
 	console.log("**************  messages:"+ request.body.room);
  var message = request.body.message;

  if(message && message.trim().length > 0) {
    var user_id    = request.body.user_id;
    var created_at = request.body.created_at;
    var user       = _.findWhere(services.participants(), { id: user_id });
	var room = request.body.room;
	
	
    // let our chatroom know there was a new message
    io.sockets.emit("incoming_message"+request.body.room, { message: message, user: user, created_at: created_at });
    
		var messagesRoom = services.messagesRooms();
		var room;
 	    for(var i = 0; i<messagesRoom.length; i++ ){
 	       if(messagesRoom[i].users.indexOf(idUser1) != -1 && messagesRoom[i].users.indexOf(idUser2) != -1){  
 	        room = messagesRoom[i];
			room.messages.push(message);
 			console.log("room trovata inserimento messaggio"+room.messages); 
 	       }
 	   }
	
		
	response.status(200).json({ message: "Message received" });
		
		
    
  } else {
    return response.json(400, { error: "Invalid message" });
  }
}


module.exports.partecipants = function(request, response) {
   response.status(200).json(services.participants());
};

module.exports.removeUserLoggato = function(request, response) {
    var partecipants = services.participants()
    var user_id = request.body.id;
    var user  = _.find(partecipants, { id: user_id });
     console.log("user_id"+user_id);
    for (var i = 0; i <partecipants.length; i++) {
        if(partecipants[i].id == user_id){
            user = partecipants[i];
            partecipants.splice(i,1);
            break;
        }
    }
    io.sockets.emit("user_disconnected", { message: 'logout', username: 'danyperry' });
    response.status(200).json(services.participants);
};

module.exports.messagesRoom = function(request, response) {
   
   var idUser1 = request.params.idUser1;
   var idUser2 = request.params.idUser2;
   var messages = services.messagesRooms();
   var room = [];
   for(var i = 0; i<messages.length; i++ ){
       if(messagesRoom[i].users.indexOf(idUser1) != -1 && messages[i].users.indexOf(idUser2) != -1){  
        room = messages[i];
       console.log("room trovata method messagesRoom: "+room.messages); 
       }
   }
    response.status(200).json(room.messages);
};

module.exports.chatRoom = function(request, response) {
    var idUser1 = request.params.idUser1;
	var idUser2 = request.params.idUser2;
	var messagesRoom = services.messagesRooms();
	var room = [];
	var roomTrovata = false;
	console.log("dentro metodo chatRoom"); 
	if(idUser1 === 'All') {
		for(var i = 0; i<messagesRoom.length; i++ ){
		   if(messagesRoom[i].users.indexOf(idUser1) != -1){  
		       room = messagesRoom[i];
		       console.log("room trovata ALL:"+ room.messages); 
		   }
		}
	}else {	
	   for(var i = 0; i<messagesRoom.length; i++ ){
	       if(messagesRoom[i].users.indexOf(idUser1) != -1 && messagesRoom[i].users.indexOf(idUser2) != -1){  
	        room = messagesRoom[i];
			roomTrovata = true;
	        console.log("room trovata metodo chatRoom"+ room.messages); 
	       }
	   }
	   if(!roomTrovata){
		   console.log("Inserimento nuova room");
		   messagesRoom.push({'users': idUser1 +" , " + idUser2 , 'messages': [] });
		   room.messages = [];
	   }
	   
	}
	console.log("return json charRoom: "+room.messages);
	response.status(200).json(room.messages);
};

