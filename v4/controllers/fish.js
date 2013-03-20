
var CaughtFish = require("../models/CaughtFish");

exports.list = function(req, res) {
  res.render("fish/list", {title:"Your fish"});
};

exports.add = function(req, res) {
  res.render("fish/add", {title:"Your fish"});
};

exports.add_post = function(req, res) {
  if( ! req.session.userId) {
    res.writeHeader(500, "content-type", "application/json");
    res.end(JSON.stringify({error:"Not logged in. Use passportjs for this."}));
  } else {
    
    var fish = new CaughtFish({
      userId: req.session.userId,
      fish: req.body["fish-type"],
      weight_lbs: req.body["fish-weight-lbs"],
      weight_oz: req.body["fish-weight-oz"]});
      
    fish.save(function(err, fish) {
    
      if(err) {
        res.locals.error = err;
        res.writeHeader(500, "content-type", "application/json");
        res.write(JSON.stringify({error:"Couldn't add fish to log"}));
      } else {
        res.setHeader("content-type", "application/json");
        res.write(JSON.stringify(fish));
      }
    });
  }
};