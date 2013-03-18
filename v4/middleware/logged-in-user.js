var User = require('../models/User'); // Don't need this, unless I load user every request which is daft

module.exports = function(req, res, next){
  res.locals.userId = req.session.userId;
  res.locals.user = req.session.user;
  next();
};