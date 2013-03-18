var redis = require("redis");
var util = require("util");
//var bcrypt = require("bcrypt");
var db = redis.createClient(); // Create long running redis connection

db.on('error', function (err) {
  console.log('REDIS ERROR: ' + err);
});

module.exports = User;

function User(obj, fn) {
  if(typeof(obj) == "object") {
    for(var key in obj) {
      this[key] = obj[key];
    }
  } else {
    this.load(obj, fn);
  }
}
// ############################################################
// # Setup some service functions attached to the User object #
// ############################################################
User.getByEmail = function(email, fn) {
  User.getIdForEmail(email, function(err, id) {
    if(err) return fn(err);
    User.get(id, fn);
  });
};

User.getIdForEmail = function(email, fn) {
  db.get("user:id:" + email, fn);
};

User.get = function(id, fn) {
  db.hgetall("user:" + id, function(err, result) {
      if(err) return fn(err);
      fn(null, new User(result));
    });
};

User.authenticate = function(email, password, fn) {
  User.getByEmail(email, function(err, user) {
    if(err){return fn(err);}
    if(!user.id){return fn("User doesn't exist");}
    if(password == user.password){return fn(null, user);}
    fn("Invalid password");
  });
};

// #######################################################
// # Setup prototype functions for all instances to share# 
// #######################################################
User.prototype.save = function(fn) {
  if(this.id) {
    this.upate(fn);
  } else {
    var self = this;
    db.incr("user:ids", function(err, id) {
      if(err) return fn(err);
      self.id = id;
      self.hashPassword(function(err) {
        if(err) return fn(error);
        self.update(fn);
      });
    });
  }
};

User.prototype.update = function(fn) {
  db.set("user:id:" + this.email, this.id); // So you can get the user id from the email
  
  //Every property you pass in as the second parameter, if it's an object, must be a
  // string value or you get "hmset expected value to be a string"
  db.hmset("user:" + this.id, this.getModelForDB(), fn);
};

// bcrypt module doesn't work in windows. Will make one up.
var bcrypt = {
  gen_salt: function(n, fn) {
    fn(null, "_salt_" + n + "_");
  },
  hash: function(password, salt, fn) {
    fn(null, password + salt);
  }
};

User.prototype.hashPassword = function(fn) {
  var self = this;
  bcrypt.gen_salt(12, function(err, salt) {
    if(err) return fn(err);
    self.salt = salt;
    bcrypt.hash(self.password, salt, function(err, hash) {
      if(err) return fn(err);
      salt.pass = hash;
      fn();
    });
  });
};

// You can't pass in an object as the second parameter if it has
// any properties that aren't strings. The id, or age for example.
User.prototype.getModelForDB = function() {
  return {
    id: "" + this.id,
    name: this.name,
    email: this.email,
    password: this.password,
    age: "" + this.age
  };
};

User.prototype.setModelFromDB = function(id, obj) {
  this.id = id;
  this.name = obj.name;
  this.email = obj.emali;
  this.password = obj.password;
  this.age = parseInt(obj.age);
};

// #########
// # TESTS #
// #########
/*

var gareth = new User( {
  name: "Gareth",
  email: "gazelms@gmail.com",
  password: "password1",
  age: 39
});

gareth.save( function(err) {
  if(err) throw err;
  var gareth2 = User.get(gareth.id, function(err, result) {
    if(err) console.log("ERR:" + err);
    console.log("RESTORED: " + util.inspect(result));  
  });
});

User.authenticate("Gareth", "monkey", function(err, user) {
  if(err) console.log(err);
  console.log(util.inspect(user));
});

User.authenticate("Gareth", "password1", function(err, user) {
  if(err) {
    console.log(err);
  } else {
    console.log(util.inspect(user));
  }
});
*/