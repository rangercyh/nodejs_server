var net = require('net');
var mysql = require('mysql');

var HOST = '10.20.127.197';
var PORT = 8124;
var TIMEOUT = 10000;

var server = net.createServer(function (socket) {
	socket.on('data', function (data) {
		var obj = JSON.parse(data.toString());
		console.log('收到数据：' + data);
		console.log(obj['username'] + ' ' + obj['password']);
	});

	socket.on('end', function () {
		console.log('客户端发来FIN，转CLOSE_WAIT，等写队列发完了，回发FIN转LAST_ACK');
		console.log('或者从FIN_WAIT2状态转TIME_WAIT状态，发ack');
		socket.end();
	});

	socket.on('error', function (exception) {
		console.log('socket error and close socket：' + exception);
	});

	socket.on('close', function () {
		console.log('socket该销毁了：');
		socket.destroy();
	});
	socket.setKeepAlive(true);
	socket.setNoDelay(true);	// 去掉nagle算法
	/*
	socket.setTimeout(TIMEOUT, function () {
		console.log('连接超时，发送FIN收ack，转FIN_WAIT_2状态');
		socket.end();
		socket.setKeepAlive(true);
	});	// 设置连接超时
	*/
	console.log('创建了一个新的socket连接：' + socket.remoteAddress + ' ' + socket.remotePort);
	var msg = {
		data:'你好，这里是nodejs服务端'
	}
	socket.write(JSON.stringify(msg));
});

server.listen(PORT, HOST);

server.on('listening', function () {
	console.log('服务器开始监听了：' + server.address().port);
});

server.on('error', function (e) {
	console('监听到一个错误：' + e);
});
