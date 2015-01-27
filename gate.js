
var net = require('net');

var session = require('./session');

var HOST = '10.20.127.197';
var PORT = 8124;
//var TIMEOUT = 10000;

var server = net.createServer(function(socket) {
	console.log('创建了一个新的socket连接：' + socket.remoteAddress + ' ' + socket.remotePort);
	session.createSession(socket);
});

server.listen(PORT, HOST);

server.on('listening', function() {
	console.log('服务器开始监听了：' + server.address().port);
});

server.on('error', function(e) {
	console.error('监听到一个错误：' + e);
});



