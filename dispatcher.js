var net = require('net');
var ExBuffer = require('ExBuffer');
var ProtoBuf = require('protobufjs');

var mysql = require('./database/db').init();

var HOST = '10.20.127.197';
var PORT = 8124;
//var TIMEOUT = 10000;

var server = net.createServer(function (socket) {
	console.log('创建了一个新的socket连接：' + socket.remoteAddress + ' ' + socket.remotePort);

	var exBuffer = new ExBuffer();	// 如何释放，默认是2个字节的len，big endian，所以一个包最长是65535字节
	exBuffer.on('data', function (buffer) {
		console.log('>> server receive data, length: ' + buffer.length);
		console.log(buffer.toString());
	});

	var hellomsg = {
		type:1,
		data:'你好，这里是nodejs服务端'
	}
	socket.write(JSON.stringify(hellomsg));

	socket.on('data', function (data) {
		exBuffer.put(data);	// 收到数据就往exbuffer里丢

		/*
		var obj = JSON.parse(data.toString());
		console.log('收到数据：' + data);
		console.log(obj['username'] + ' ' + obj['password']);

		var sql = 'select * from userinfo where username = ?'
		mysql.query(sql, [obj['username']], function (err, result, fields) {
			if (err !== null) {
				console.error('error :');
				console.error(err.code);
				console.error(err.fatal);
				console.error(err.stack);
			} else {
				var auth = false;
				if (result.length > 0) {
					var password = result[0].password;
					if (password === obj['password']) {
						auth = true;
					}
				}
				console.log('查出了数据');
				socket.write(JSON.stringify({type:2,data:auth}));
			}
		});
	*/
	});

	socket.on('end', function () {
		console.log('客户端发来FIN，转CLOSE_WAIT，等写队列发完了，回发FIN转LAST_ACK');
		console.log('或者从FIN_WAIT2状态转TIME_WAIT状态，发ack');
	});

	socket.on('error', function (exception) {
		console.error('socket error and close socket：' + exception);
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
});

server.listen(PORT, HOST);

server.on('listening', function () {
	console.log('服务器开始监听了：' + server.address().port);
});

server.on('error', function (e) {
	console.error('监听到一个错误：' + e);
});



