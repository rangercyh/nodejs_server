
var net = require('net');

var Session = require('../module/session');


module.exports = function(HOST, PORT) {
	var g_Session = new Session(),
	/*
	[sessionid] : {
		uuid:
		connectTime:
	}
	*/
		g_Handler = {},
		server = net.createServer();

	server.on('connection', function(socket) {
		console.log('创建了一个新的socket连接：' + socket.remoteAddress + ' ' + socket.remotePort);
		var id = g_Session.createSession(socket);
		if (id !== 0) {
			g_Handler[id] = {
				connectTime : Date.now(),
			};
		}
	});

	server.on('listening', function() {
		console.log('服务器开始监听了：' + server.address().port);
	});

	server.on('error', function(e) {
		console.error('监听到一个错误：' + e);
	});

	// 处理session消息
	g_Session.on('destroy', function(sessionid) {
		console.log('一个client走了：' + sessionid);
	});

	// gate模块只处理一种协议：login
	g_Session.on('data', function(msg) {

	});

	server.listen(PORT, HOST);
};


