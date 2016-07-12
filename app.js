var express = require('express');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var moment = require('moment');

app.use(express.static('static'));

list = [];

io.on('connect', function(socket){
	socket.on("sendName",function(name,issue){
		a = {
			"name" : name,
			"time" : moment(),
			"issue": issue
			}
		console.log("Added " + name);
		list.push(a);
		socket.emit("update",list);
	});
	socket.on("pop",function()
	{
		console.log("Popped");
		list.pop();
		socket.emit("update",list);
	});
});

http.listen(3000, function(){	
	console.log("App listening on port 3000!");
});

