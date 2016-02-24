var User = require('./user.model');
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

function checkIfExitUser(res){
	var trovato = false;
	return function(entity) {
		//console.log(entity);
    	if (entity.length == 0) {
    		trovato = false;    	}
    	else{ 
    		trovato = true;
    	}
	};
	return trovato;
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
module.exports.authenticate = function(req, res) {
  User.findAsync({ 'username': req.body.username, 'password': req.body.password})
    .then(handleEntityNotFound(res))
    .then(respondWithResult(res))
    .catch(handleError(res));
    
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
