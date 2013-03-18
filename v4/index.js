var http = require("http");
var util = require("util");
var path = require("path");
var mime = require("mime");
var ejs = require("ejs");
var fs = require("fs");
var express = require("express");
var controllers = {};
controllers.main = require("./controllers/main");
controllers.fish = require("./controllers/fish");
controllers.user = require("./controllers/user");

var _fishLog = {
  fishlog: [
    {name:"Perch", weight:{lbs:4, oz:14}},
    {name:"Tench", weight:{lbs:8, oz:3}},
    {name:"Bream", weight:{lbs:12, oz:1}},
    {name:"Carp", weight:{lbs:27, oz:7}},
    {name:"Rudd", weight:{lbs:3, oz:9}},
  ]
};
var _session = {currentFish:{name:"", weight:{lbs:0, oz:0}}}; // This will do for now

ejs.open = '{{';
ejs.close = '}}';
console.log(util.inspect(ejs));
var app = express();

// Setup the middleware
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  
  app.use(express.favicon());
  app.use("/public", express.static(path.join(__dirname, 'public')));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(express.cookieParser('your secret here'));
  app.use(express.session());
  app.use(require("./middleware/init-request"));
  app.use(require("./middleware/logged-in-user"));
  app.use(require("./middleware/view-helpers"));
  app.use(app.router);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'ejs');
  app.engine('ejs', require('ejs-locals'));
});

app.get("/", controllers.main.index);
app.get("/fish", controllers.fish.list);
app.get("/fish/add", controllers.fish.add);
app.post("/fish/add", controllers.fish.add_post)
app.get("/login", controllers.user.login);
app.post("/login", controllers.user.login_post);
app.get("/logout", controllers.user.logout);
app.get("/register", controllers.user.register);

app.post("/register", controllers.user.register_post);

// ###########################

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
