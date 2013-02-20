var http = require("http");
var util = require("util");
var path = require("path");
var mime = require("mime");
var fs = require("fs");
var _formidable = require("formidable");

var server = http.createServer(function(req, res) {
	console.log(req.url);
	switch(req.method) {
		case "GET" : {
			var url = req.url;
			if(url == "/") url = "index.html";
			serveFile(res, url);
			break;
		}
		case "POST" : {
			var form = new _formidable.IncomingForm();
			form.parse(req, function(err, fields, files) {
			  res.writeHead(200, {'content-type': 'text/plain'});
			  res.write('received upload:\n\n');
			  res.end(util.inspect({fields: fields, files: files}));
			  //console.log(util.inspect({fields: fields, files: files}));
			  serveFile(res, "index.html");
			});
			break;
		}
	};
	
}).listen(3000);

function serve404(res) {
	res.writeHead(404, {"content-type": "text/plain"});
	res.end("Error : Resource not found");
}

function serveFile(res, fileName) {
	fileName = "./public/" + fileName
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