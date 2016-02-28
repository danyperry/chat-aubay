var participants = [];

var messagesRooms = [];



module.exports.initRooms = function() {
    var rooms = [{ 
	        users: 'All',
	        messages: []
	    }];
	messagesRooms.push(rooms);
	
}

module.exports.participants = function() {
    return participants;
}

module.exports.messagesRooms = function() {
    return messagesRooms;
}




