var express = require('express');
var controller = require('./messages.controller');

var router = express.Router();

router.post('/initRooms', controller.initRooms);
router.post('/chatMessages', controller.chatMessages);
router.post('/messages', controller.messages);
router.get('/partecipants', controller.partecipants);
router.post('/removeUserLoggato', controller.removeUserLoggato);
router.post('/messagesRoom', controller.messagesRoom);


module.exports = router;