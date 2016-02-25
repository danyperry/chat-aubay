var mongoose = require('bluebird').promisifyAll(require('mongoose'));

var UserSchema = new mongoose.Schema({
  nome: String,
  cognome: String,
  username: String,
  password: String,
  role: {
    type: String,
    default: 'admin'
  }
});

module.exports = mongoose.model('User', UserSchema);
