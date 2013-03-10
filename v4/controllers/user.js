var User = require("../lib/models/User");
var util = require("util");

function initViewModel_login(res, email) {
  if( ! res.locals.viewModel) { // Otherwise an invalid logon would wipe out the email from the view model
    res.locals.viewModel = {email:email};
  }
}

exports.login = function(req, res) {
  initViewModel_login(res, "");
  res.render("user/login", {title:"Login"});
};

exports.login_post = function(req, res) {
  User.authenticate(req.body.email, req.body.password, function(err, user) {
    if(err) {
      res.locals.error = err;
      initViewModel_login(res, req.body.email);
      exports.login(req, res);
    } else {
      initUserSession(req, user);
      res.redirect("/");
    }
  });
};

exports.logout = function(req, res) {
  req.session.userId = res.locals.userId = null;
  req.session.user = res.locals.user = null;
  res.redirect("/");
};

exports.register = function(req, res) {
  res.render("user/register", {title:"Register"});
};

function initUserSession(req, user) {
  req.session.userId = user.id;
  req.session.user = user;
}

exports.register_post = function(req, res) {

  function registrationError(err) {
    res.locals.error = err;
    exports.register(req, res);
  }

  User.getByEmail(req.body.email, function(err, user) {
    if(err) {
      registrationError(err);
    } else if(user.id) {
      registrationError("Sorry this email is already taken");
    } else {    
      var newUser = new User( {
        email: req.body.email,
        password: req.body.password,
        name: req.body.name,
        age: req.body.age
      });

      newUser.save( function(err, result) {
        if(err){
          registrationError(err);
        } else {
          initUserSession(req, newUser);
          //req.session.userId = newUser.id;
          //req.session.user = newUser;
          res.redirect("/");
        }
      });
    }
  });
};