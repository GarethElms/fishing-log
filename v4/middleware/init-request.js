
module.exports = function(req, res, next){
  res.locals.session = req.session; // So that views can access the session object directly
  next();
};