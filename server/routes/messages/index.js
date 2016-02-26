var express = require('express');
var controller = require('./messages.controller');

var auth = require('./auth.service');

var router = express.Router();

router.post('/messages', controller.messages);


module.exports = router;