var CaughtFish = require("../Models/CaughtFish");

exports.index = function(req, res) {
  CaughtFish.getListOfUsersFish(req.session.userId, function(err, fishes) {
    if(err) {
      res.locals.error = err;
    }
    var fishesArray = [];
    for(var fish in fishes) {
      fishesArray.push(JSON.parse(fishes[fish]));
    }
    res.locals.viewModel = {fishes:fishesArray};
    res.render("main/index", {});
  });
};