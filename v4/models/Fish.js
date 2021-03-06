var redis = require("redis");
var util = require("util");
var User = require("./User");

var db = redis.createClient(); // Create long running redis connection
db.on('error', function (err) {
  console.log('REDIS ERROR: ' + err);
});

module.exports = CaughtFish;

function CaughtFish(obj, fn) {
  if(typeof(obj) == "object") {
    for(var key in obj) {
      this[key] = obj[key];
    }
  }
}
// ############################################################
// # Setup some service functions attached to the User object #
// ############################################################
CaughtFish.doSomething = function(email, fn) {
};

// #######################################################
// # Setup prototype functions for all instances to share# 
// #######################################################
CaughtFish.prototype.save = function(fn) {
  if(this.id) {
    this.upate(fn);
  } else {
    var self = this;
    db.incr("caughtFish:user:" + this.userId, function(err, id) {
      if(err) return fn(err);
      self.id = id;
      self.update(fn);
    });
  }
};

CaughtFish.prototype.getListOfUsersFish = function(userId, fn) {
  fn("Not implemented");
};

// UP TO HERE : This isn't right. I need to research looking up items in a list by id. I'll need
// this when I edit an item. Kind of a waste of time because  I'm not even using Redis for
// caching now since I've learned about how it likes to use more ram than you might want it to.
// Anyway, see this through as I'm learning module practices here too..

User.prototype.update = function(fn) {
  //db.set("user:id:" + this.email, this.id); // So you can get the user id from the email
  
  // Every property you pass in as the second parameter, if it's an object, must be a
  // string value or you get "hmset expected value to be a string"
  db.hmset("caughtFish:user:" + this.userId, this.getModelForDB(), fn);
};

// You can't pass in an object as the second parameter if it has
// any properties that aren't strings. The id, or age for example.
User.prototype.getModelForDB = function() {
  return {
    id: "" + this.id,
    userId: "" + this.userId,
    fish: this.fish,
    weight_lbs: this.weight_lbs,
    weight_oz: this.weightoz
  };
};

User.prototype.setModelFromDB = function(id, obj) {
  this.id = id;
  this.userId = userId;
  this.fish = obj.fish;
  this.weight_lbs = obj.weight_lbs;
  this.weight_oz = obj.weight_oz;
};