var express = require('express');
var controller = require('./user.controller');

var auth = require('./auth.service');

var router = express.Router();
router.post('/authenticate', controller.authenticate);
router.get('/users', controller.index);
router.get('/users/me', auth.isAuthenticated(), controller.me);
router.get('/users/logged', controller.userLogged);
//router.get('/users/:id', controller.show);
router.get('/users/:username', controller.showUser);
router.post('/users', controller.create);
router.delete('/users/:id', controller.destroy);
router.put('/users/:id', controller.update);


module.exports = router;