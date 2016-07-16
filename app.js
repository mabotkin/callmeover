var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');
var dotenv = require("dotenv").config();
var auth = require('http-auth');

var basic = auth.basic({
	realm: "Web."
	}, function (username, password, callback) { // Custom authentication method.
		callback(username == process.env.USER && password == process.env.PASS);
});

app.get("/admin.html",auth.connect(basic));

app.use(express.static('static'));

list = [];
message = "";

io.on('connect', function(socket){
	socket.emit("update",list);
	socket.emit("newmotd",message);
	socket.on("sendName",function(name,issue){
		a = {
			"name" : name,
			"time" : moment(),
			"issue": issue,
			"message": ""
			}
		console.log("Added " + name);
		list.push(a);
		io.emit("update",list);
	});
	socket.on("pop",function()
	{
		console.log("Popped");
		list.shift();
		io.emit("update",list);
	});
	socket.on("clear",function()
	{
		console.log("Cleared");
		list = [];
		io.emit("update",list);
	});
	socket.on("motd",function(motd)
	{
		message = motd;
		socket.broadcast.emit("newmotd",motd);
	});
	socket.on("newmes",function(newmes)
	{
		list[newmes.ind].message = newmes.mes;
		socket.broadcast.emit("update",list);
	});
});

http.listen(3000, function(){	
	console.log("App listening on port 3000!");
});

