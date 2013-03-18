
var Fish = require("../models/Fish");

exports.list = function(req, res) {
  res.render("fish/list", {title:"Your fish"});
};

exports.add = function(req, res) {
  res.render("fish/add", {title:"Your fish"});
};

exports.add_post = function(req, res) {
  res.setHeader("content-type", "application/json");
};