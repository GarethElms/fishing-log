//var ejs = require("ejs");

exports.index = function(req, res) {
  res.render("main/index", {});
  //res.send("test"); // WORKS
};