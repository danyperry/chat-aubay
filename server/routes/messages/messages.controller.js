var User = require('./user.model');
var Logged = require('./logged.model');
var Auth = require('./auth.service');
var lodash = require("lodash");

function messages(request, response){
  var message = request.body.message;

  if(message && message.trim().length > 0) {
    var user_id    = request.body.user_id;
    var created_at = request.body.created_at;
    var user       = _.findWhere(participants, { id: user_id });

    // let our chatroom know there was a new message
    io.sockets.emit("incoming_message", { message: message, user: user, created_at: created_at });

    response.json(200, { message: "Message received" });
  } else {
    return response.json(400, { error: "Invalid message" });
  }
}

