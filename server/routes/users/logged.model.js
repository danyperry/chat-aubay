var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var LoggedSchema = new mongoose.Schema({
  _id: String,
  username: String
});

module.exports = mongoose.model('Logged', LoggedSchema);