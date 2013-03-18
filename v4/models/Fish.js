var redis = require("redis");
var util = require("util");
var User = require("./User");

var db = redis.createClient(); // Create long running redis connection
db.on('error', function (err) {
  console.log('REDIS ERROR: ' + err);
});

module.exports = Fish;

function Fish(obj, fn) {
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
Fish.getByEmail = function(email, fn) {
  User.getIdForEmail(email, function(err, id) {
    if(err) return fn(err);
    Fish.getByUserId(id, fn);
  });
};

User.getByUserId = function(id, fn) {
  db.zadd("user:" + id + ":fish", function(err, result) {
      if(err) return fn(err);
      
      var fishes = [];
      for(var fish in result) {
        fishes.push(new Fish(fish));
      }
      fn(null, fishes);
    });
};

// #######################################################
// # Setup prototype functions for all instances to share# 
// #######################################################
Fish.prototype.save = function(fn) {
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