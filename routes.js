 module.exports = function(app) {
  // Insert routes below
    app.use('/api/', require('./server/routes/users'));
    app.use('/chat/', require('./server/routes/messages'));
    
    
    // middleware to use for all requests
    app.use('/ap/', function (req, res) {
        res.send("ciao a tutti prova");
    });
    
 
 }