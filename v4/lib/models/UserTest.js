var redis = require("redis");
var util = require("util");
var db = redis.createClient(); // Create long running redis connection

// NEED THIS LATER module.exports = User;

function User(obj) {
  for(var key in obj) {
    this[key] = obj[key];
  }
}

// Use the prototype so all isntances of User share the same base methods.
User.prototype.save = function(fn) {
  if(this.id) {
    this.upate(fn);
  } else {
    var self = this;
    db.incr("user:ids", function(err, id) {
      if(err) return fn(err);
      self.id = id;
      self.update(fn);
    });
  }
};

User.prototype.update = function(fn) {

console.log(this.id);
console.log(this.name);
console.log(this.password);
console.log(this.age);
console.log("user:" + this.id);

  var bloke = JSON.stringify(this);
  db.set("user:id:" + this.name, this.id, function(err, reply){console.log(".set " + reply);})
  db.hmset("user:" + this.id, {name:this.name, password:this.password}, fn); // FAILS

  

  //db.hmset("user:" + this.id, this, fn); // FAILS
  //db.hmset("user:" + this.id, JSON.stringify(this), function(err){fn();}); // WORKS
  //db.hmset("user:" + this.id, JSON.stringify(this), function(err, result){fn();}); // WORKS
  //db.hmset("user:" + this.id, JSON.stringify(this), function(err, result){fn(err);}); // FAILS
};

var gareth = new User( {
  "name": "Gareth2",
  "password": "password1",
  "age": "39"
});

gareth.save( function(err) {
  //if(err) throw err;
  //console.log("Gareth's user id = " + this.id);
});

