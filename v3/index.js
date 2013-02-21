var http = require("http");
var util = require("util");
var path = require("path");
var mime = require("mime");
var fs = require("fs");
var _formidable = require("formidable");
var jade = require("jade");

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

var server = http.createServer(function(req, res) {
  console.log(req.url);
  switch(req.method) {
    case "GET" : {
      var url = req.url;
      //if(url == "/") url = "index.html";
      //serveFile(res, url);
      if(url == "/") {
        url = "/index.jade";
      }
      if(url.match(/^\/public\//)) {
        serveFile(res, url);
      } else {
        serveJade(res, url);
      }
      break;
    }
    case "POST" : {
      var form = new _formidable.IncomingForm();
      form.parse(req, function(err, fields, files) {
        var currentFish = {name:fields["fish-type"], weight:{lbs:fields["fish-weight-lbs"], oz:fields["fish-weight-oz"]}};
        _session.currentFish = currentFish;
        _fishLog.fishlog.push(currentFish);
        serveRedirect(res, "/");
      });
      break;
    }
  };
  
}).listen(3000);

function serve404(res) {
  res.writeHead(404, {"content-type": "text/plain"});
  res.end("Error : Resource not found");
}

function serveRedirect(res, url) {
  res.writeHead(302, {"location":url});
  res.end("Redirecting to <a href='" + url + "'>here</a>");
}

function serveJade(res, fileName) {
  fileName = __dirname + "/views" + fileName
  if(!fileName.match(/.jade$/)) {
    fileName += ".jade";
  }
  fs.exists(fileName, function(exists) {
    console.log("jade: Does " + fileName + " exist?");
    if(exists) {
      fs.readFile(fileName, function(err, data) {
        if(err) {
          console.log("Nope.");
          serve404(res);
        } else {
          console.log("Yes....");
          res.writeHeader(200, {"content-type": "text/html"}); //mime.lookup(path.basename(fileName))});
          var fn = jade.compile(data, {filename:fileName, pretty:true});
          var result = fn({fishlog:_fishLog.fishlog, currentFish:_session.currentFish});//{fishlog:_fishLog.fishlog, currentFish:_session.currentFish});
          res.end(result);
        }
      });
    } else {
      serve404(res);
    }
  });
}

function serveFile(res, fileName) {
  if(fileName.match(/^\/public\//)) {
    fileName = "." + fileName;
  } else {
    fileName = "./public/" + fileName
  }
  fs.exists(fileName, function(exists) {
    console.log("Does " + fileName + " exist?");
    if(exists) {
      fs.readFile(fileName, function(err, data) {
        if(err) {
          console.log("Nope.");
          serve404(res);
        } else {
          console.log("Yes.");
          res.writeHeader(200, {"content-type": mime.lookup(path.basename(fileName))});
          res.end(data);
        }
      });
    } else {
      serve404(res);
    }
  });
}