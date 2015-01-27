// session管理
var Const = require('./const');
var ExBuffer = require('ExBuffer');

var dispatcher = require('./dispatcher');

var _sessionHandler = {};
var _sessionid = 1;	// 逐渐递增，之后思考一种sessionid维护规则，可以回收淘汰的id


function listenEvent(_sessionid) {
	if (_sessionHandler[_sessionid]) {
		var socket = _sessionHandler[_sessionid]._socket;
		if (socket) {
			// data use exbuffer
			var exBuffer = new ExBuffer();
			exbuffer.on('data', function(buffer) {
				var msgid = buffer.toString('base64', 2, 4);
				dispatcher(buffer.toString('base64', 4), msgid, socket);
			});
			socket.on('data', function(data) {
				exBuffer.put(data);
			});

			socket.on('end', function() {
				console.log('客户端发来了FIN');
			});

			socket.on('error', function() {
				console.error('socket error and close socket: ' + exception);
			});

			socket.on('close', function() {
				module.exports.destroy(_sessionid);
			});

			socket.setKeepAlive(true);
			socket.setNoDelay(true);
		}
	}
}

module.exports.createSession = function(socket) {
	_sessionid = _sessionid + 1;
	if (_sessionHandler[_sessionid]) {
		// sessionid重用，需要增加通知前一个socket断开，重新绑定新的
		delete _sessionHandler[_sessionid];
	}
	_sessionHandler[_sessionid] = {
		_state : Const.session_state.SOCKET_STATE_IDLE,
		_socket : socket,
		_playerid : 0,
		_playername : ""，
		//_lasthealth : 心跳包的设计
	};

	listenEvent(_sessionid);

	// var exBuffer = new ExBuffer();	// 如何释放，默认是2个字节的len，big endian，所以一个包最长是65535字节
	// exBuffer.on('data', function(buffer) {
	// 	console.log('>> server receive data, length: ' + buffer.length);
	// 	console.log(buffer.toString());

	// 	var msgid = buffer.toString('base64', 2, 4);
	// 	dispatcher(buffer.toString('base64', 4), msgid, socket);
	// });

	//var hellomsg = {
	//	type:1,
	//	data:'你好，这里是nodejs服务端'
	//};
	//socket.write(JSON.stringify(hellomsg));

	// socket.on('data', function(data) {
	// 	exBuffer.put(data);	// 收到数据就往exbuffer里丢
	// });

	// socket.on('end', function() {
	// 	console.log('客户端发来FIN，转CLOSE_WAIT，等写队列发完了，回发FIN转LAST_ACK');
	// 	console.log('或者从FIN_WAIT2状态转TIME_WAIT状态，发ack');
	// });

	// socket.on('error', function(exception) {
	// 	console.error('socket error and close socket：' + exception);
	// });

	// socket.on('close', function() {
	// 	console.log('socket该销毁了：');
	// 	module.exports.destroy(_sessionid);
	// });
	// socket.setKeepAlive(true);
	// socket.setNoDelay(true);	// 去掉nagle算法

	/*
	socket.setTimeout(TIMEOUT, function() {
		console.log('连接超时，发送FIN收ack，转FIN_WAIT_2状态');
		socket.end();
		socket.setKeepAlive(true);
	});	// 设置连接超时
	*/
};

module.exports.bind = function(sessionid, playerid, playername) {
	if (getSessionState(sessionid) == Const.session_state.SOCKET_STATE_IDLE) {
		_sessionHandler[sessionid]._playerid = playerid;
		_sessionHandler[sessionid]._playername = playername;
		_sessionHandler[sessionid]._state = Const.session_state.SOCKET_STATE_LOGIN;
	}
};

module.exports.getSessionState = function(sessionid) {
	if (_sessionHandler[sessionid]) {
		return _sessionHandler[sessionid]._state;
	}
	return null;
};

module.exports.getSession = function(sessionid) {
	return _sessionHandler[sessionid];
};

module.exports.destroy = function(sessionid) {
	if (_sessionHandler[sessionid]._socket) {
		_sessionHandler[sessionid]._socket.destroy();
	}
	delete _sessionHandler[sessionid];
};

