var User = require('./user.model');
var Logged = require('./logged.model');
var Auth = require('./auth.service');
var lodash = require("lodash");

function respondWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
       
    if (entity) {
    	res.success = true;
         res.status(statusCode).json(entity);
      //console.log(entity);
    }
  };
}

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
     };
}



function handleEntityNotFound(res) {
    
  return function(entity) {
    if (entity.length == 0) {
      res.status(404).end();
      //res.end();
      return null;
    }

    return entity;
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.removeAsync()
        .then(() => {
          res.status(204).end();
        });
    }
  };
}

function saveUpdates(updates) {
  return function(entity) {
    var updated = lodash.merge(entity, updates);
    return updated.saveAsync()
      .spread(updated => {
        return updated;
      });
  };
}


// Gets a list of Things
module.exports.index = function(req, res) {
    //res.send("ciao index");
    //res.json({ message: 'User index!' });
    
  //User.createAsync({ nome: 'dany', cognome : 'perry', email: 'dperry@hotmail.it' });
  User.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
  //res.send("ciao index");  
}

module.exports.create = function(req, res) {
	var trovato = false;
	User.findAsync({ 'username': req.body.username})
	.then(function(entity) {
		if (entity.length == 0) {
			res.success = true;
		}
    	else{ 
    		trovato = true;
    		return res.status(404).end();
    	}
	}).then(function(entity) {
		if(!trovato){
			User.createAsync(req.body)
		    	.then(respondWithResult(res, 200))
		    	.catch(handleError(res));
	    }
	});

}    

module.exports.destroy = function(req, res) {
 User.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
}  

// Gets a single Thing from the DB
module.exports.show = function(req, res) {
  User.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}
module.exports.showUser = function(req, res) {
  User.findAsync({ 'username': req.params.username})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

// Gets a single Thing from the DB
module.exports.authenticate = function(req, res, next) {
 
  User.findOneAsync({ 'username': req.body.username.username, 'password': req.body.username.password})
  
    //.then(handleEntityNotFound(res))
    .then(user => {
      if (user) {
        var token = Auth.signToken(user._id, user.role);
        addLogged(user._id, user.username); 
        res.json({ token });
      }else{
          /* err.message= 'This password is not correct.';
            res.json({ err });*/ 
          return res.status(401).json({message: 'This password is not correct.'});
      }
      
    })
    .catch(err => { 
            err.message= ' Si è verificato un problema nel login. ';
            res.json({ err });
            next(err) }
    );
    

  
  
    
    //.then(handleEntityNotFound(res))
    //.then(respondWithResult(res))
    
    
  /*User.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));*/
}

// Updates an existing Thing in the DB
module.exports.update = function(req, res) {
  
  User.findByIdAsync(req.params.id)
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(respondWithResult(res))
    .catch(handleError(res));
}

/**
 * Get my info
 */
module.exports.me = function(req, res, next) {
  var userId = req.user._id;

  User.findOneAsync({ _id: userId }, '-salt -password')
    .then(user => { // don't ever give out the password or salt
      if (!user) {
        return res.status(401).end();
      }
      res.json(user);
    })
    .catch(err => next(err));
}

module.exports.userLogged = function(req, res, next) {
   Logged.findAsync()
    .then(respondWithResult(res))
    .catch(handleError(res));
}

function addLogged(id,username){
    console.log("id user:"+id);
    Logged.findOneAsync({ _id: id }, '-salt -password')
   
	.then(user => { // don't ever give out the password or salt
      if (!user) {
         console.log("entrato in null" + user);
	     Logged.createAsync({ '_id': id, 'username': username});
		}
      })
      .catch(err => console.log("errore message"));
}

