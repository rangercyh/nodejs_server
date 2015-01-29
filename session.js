// session管理
var Const = require('./const');
var ExBuffer = require('ExBuffer');

var dispatcher = require('./dispatcher');

var _sessionHandler = {};
var _sessionid = 1;	// 逐渐递增，之后思考一种sessionid维护规则，可以回收淘汰的id
var _HealthTime = 3 * 60 * 1000;	// 心跳超时时间

// var _HealthTime = 3 * 1000;



function destroy(sessionid) {
	if (_sessionHandler.hasOwnProperty(sessionid) && _sessionHandler[sessionid].hasOwnProperty("_socket")) {
		_sessionHandler[sessionid]._socket.destroy();
	}

	// 通知数据模块清除该sessionid绑定的数据块
	// clearuserdata();

	delete _sessionHandler[sessionid];
}

// session的清除有两处，一处是服务器开启的定时器任务，每隔一个CHECK_HEALTH_TIME进行一次清除
// 还有一处是客户端主动断开连接，触发close事件就主动清除
function listenEvent(_sessionid) {
	if (_sessionHandler[_sessionid]) {
		var socket = _sessionHandler[_sessionid]._socket,
			exBuffer = new ExBuffer();	// 2bytes len + 2bytes msgid + data
		if (socket) {
			// data use exbuffer
			exBuffer.on('data', function(buffer) {
				var msgid = buffer.toString('base64', 2, 4);
				dispatcher(buffer.toString('base64', 4), msgid, _sessionid);
			});
			socket.on('data', function(data) {
				exBuffer.put(data);
				_sessionHandler[_sessionid]._lasthealth = Date.now();
			});

			socket.on('end', function() {
				console.log('客户端发来了FIN');
				_sessionHandler[_sessionid]._state = Const.session_state.SESSION_STATE_CLIENT_END;
			});

			socket.on('error', function(e) {
				console.error('socket error and close socket: ' + e);
			});

			socket.on('close', function() {
				destroy(_sessionid);
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
		_state : Const.session_state.SESSION_STATE_IDLE,
		_socket : socket,
		_username : "",
		_playerid : 0,
		_playername : "",
		_lasthealth : 0,
		_connecttime : Date.now()
	};

	listenEvent(_sessionid);
};

// 把username重复的标记上需要清除
function markDuplicates(username) {
	var id;
	for (id in _sessionHandler) {
		if (_sessionHandler.hasOwnProperty(id) &&
			(_sessionHandler[id]._username === username)) {
			_sessionHandler[id]._state = Const.session_state.SESSION_CLEAR;
		}
	}
}

module.exports.bind = function(sessionid, username, playerid, playername) {
	if (module.exports.getSessionState(sessionid) === Const.session_state.SESSION_STATE_IDLE) {
		markDuplicates(username);

		_sessionHandler[sessionid]._username = username;
		_sessionHandler[sessionid]._playerid = playerid;
		_sessionHandler[sessionid]._playername = playername;
		_sessionHandler[sessionid]._state = Const.session_state.SESSION_STATE_LOGIN;

		return true;
	}
	return false;
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

module.exports.checkHealth = function() {
	var id,
		curTime = Date.now();
	for (id in _sessionHandler) {
		if (_sessionHandler.hasOwnProperty(id)) {
			console.log('socket' + (curTime - _sessionHandler[id]._lasthealth));
			if ((_sessionHandler[id]._state === Const.session_state.SESSION_CLEAR) ||
				((curTime - _sessionHandler[id]._lasthealth) > _HealthTime)) {
				console.log('清掉了socket' + (curTime - _sessionHandler[id]._lasthealth));
				destroy(id);
			}
		}
	}
};

module.exports.send = function(id, msg) {
	if (_sessionHandler.hasOwnProperty(id) &&
		(_sessionHandler[id].hasOwnProperty('socket')) &&
		(_sessionHandler[id]._state !== Const.session_state.SESSION_CLEAR)) {
		_sessionHandler[id].socket.write(msg);
	}
};

// 检查session是否存在，如果存在数据就弄过来，通知数据模块sessionid变化
module.exports.reConnect = function(newID, username) {
	var id;
	if (_sessionHandler.hasOwnProperty(newID)) {
		for (id in _sessionHandler) {
			if (_sessionHandler.hasOwnProperty(id) &&
				(_sessionHandler[id]._username === username)) {
				// changesessionid(id, newID); 没有找到就重新生成,在这个函数里触发bind重新绑定
				return true;
			}
		}
	}
	return false;
};
