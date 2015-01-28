// session管理
var Const = require('./const');
var ExBuffer = require('ExBuffer');

var dispatcher = require('./dispatcher');

var _sessionHandler = {};
var _sessionid = 1;	// 逐渐递增，之后思考一种sessionid维护规则，可以回收淘汰的id
var _HealthTime = 3 * 60 * 1000;	// 心跳超时时间



function listenEvent(_sessionid) {
	if (_sessionHandler[_sessionid]) {
		var socket = _sessionHandler[_sessionid]._socket;
		if (socket) {
			// data use exbuffer
			var exBuffer = new ExBuffer();	// 2bytes len + 2bytes msgid + data
			exBuffer.on('data', function(buffer) {
				var msgid = buffer.toString('base64', 2, 4);
				dispatcher(buffer.toString('base64', 4), msgid, socket);
			});
			socket.on('data', function(data) {
				exBuffer.put(data);
				_sessionHandler[_sessionid]._lasthealth = Date.now();
			});

			socket.on('end', function() {
				console.log('客户端发来了FIN');
				_sessionHandler[_sessionid]._state = Const.session_state.SOCKET_STATE_CLIENT_END;
			});

			socket.on('error', function() {
				console.error('socket error and close socket');
			});

			socket.on('close', function() {
				module.exports.destroy(_sessionid);
			});

			//socket.setKeepAlive(true);	// 不使用linux的keepalive，用心跳包代替
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
		_playername : "",
		_lasthealth : 0,
		_connecttime : Date.now()
	};

	listenEvent(_sessionid);
};

function checkDuplicates(playerid) {
	var id;
	for (id in _sessionHandler) {
		if (_sessionHandler.hasOwnProperty(id) && (_sessionHandler[id]._playerid === playerid)) {
			module.exports.destroy(id);
		}
	}
}

module.exports.bind = function(sessionid, playerid, playername) {
	if (module.exports.getSessionState(sessionid) === Const.session_state.SOCKET_STATE_IDLE) {
		// 排重，只需要session排重，后端数据自己会处理重复
		checkDuplicates(playerid);

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

module.exports.checkHealth = function() {
	var id;
	var curTime = Date.now();
	for (id in _sessionHandler) {
		if (_sessionHandler.hasOwnProperty(id) && ((curTime - _sessionHandler[id]._lasthealth) > _HealthTime)) {
			// 通知数据模块清掉玩家数据
			module.exports.destroy(id);
		}
	}
};
