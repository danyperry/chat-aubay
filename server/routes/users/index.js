var express = require('express');
var controller = require('./user.controller');

var router = express.Router();
router.post('/authenticate', controller.authenticate);
router.get('/users', controller.index);
router.get('/users/:id', controller.show);
router.post('/users', controller.create);
router.delete('users/:id', controller.destroy);
router.put('users/:id', controller.update);

module.exports = router;