// session管理
/*
设计原则是尽量把session模块独立化出来
使得任何需要session相关功能的模块都可以引用session然后自己管理
抛出消息：destroy、data
*/
var State = require('./const').SESSION_STATE;

var ExBuffer = require('ExBuffer');
var EventEmitter = require('events').EventEmitter;
var util = require('util');

function destroy(sessionid) {
	if (this._sessionHandler.hasOwnProperty(sessionid) &&
		this._sessionHandler[sessionid].hasOwnProperty("_socket")) {
		this._sessionHandler[sessionid]._socket.destroy();
	}

	delete this._sessionHandler[sessionid];

	// 如果清除了socket，需要发出清除消息让外界知道，外界可以捕获信号
	this.emit('destroy', sessionid);
}

/* 服务端心跳包维护
心跳包由客户端发送，客户端有两种实现选择，可以直接每隔1min发送一个，
也可以距离上一次正常数据发送后1min才开始发。两种实现对服务端都一样。

服务端在收到心跳包或者正常数据时，都去更新socket列表的lasthealth时间戳，
这个时间使用服务器上的时间，因为不信任客户端的时间，然后服务器上设置定时器，
每隔5min（时间可调）检查一下所有的socket列表lasthealth，如果发现lasthealth距离当前时间超过3min（时间可调），
则认为客户端断线了。同时服务器对客户端的每条协议包括心跳包都需要立刻回复。

客户端无论是发送正常数据还是心跳包，都开启个定时器检查，超时即认为和服务器断开连接，走重连处理
*/
// 据说这个版本的nodejs的interval不稳定，时间有差池而且会积累，待观察
function checkHealth() {
	var id,
		curTime = Date.now();
	for (id in this._sessionHandler) {
		if (this._sessionHandler.hasOwnProperty(id)) {
			//console.log('socket' + (curTime - this._sessionHandler[id]._lasthealth));
			if ((this._sessionHandler[id]._state === State.SESSION_NEED_CLEAR) ||
				((curTime - this._sessionHandler[id]._lasthealth) > this._HealthTime)) {
				//console.log('清掉了socket' + (curTime - this._sessionHandler[id]._lasthealth));
				destroy.call(this, id);
			}
		}
	}
}

// 使用方法是当作构造函数用
/*
healthTime:设置session的心跳超时时间
checkTime:心跳检查间隔
*/
var Session = function(healthTime, checkTime) {
	this._sessionHandler = {};
	this._sessionid = 0;	// 逐渐递增，之后思考一种sessionid维护规则，可以回收淘汰的id
	this._HealthTime = 3 * 60 * 1000;	// 心跳超时时间
	if (healthTime && !isNaN(healthTime)) {
		this._HealthTime = healthTime;
	}

	var _checkHealthTime = 5 * 60 * 1000;	// 检查心跳时间
	if (checkTime && !isNaN(checkTime)) {
		_checkHealthTime = checkTime;
	}

	EventEmitter.call(this);
	setInterval(checkHealth.bind(this), _checkHealthTime);
};

util.inherits(Session, EventEmitter);

module.exports = Session;

// session的清除有三处
// 一处是心跳检查（心跳超时，标记清除）
// 一处是客户端主动断开连接直接destroy
// 一处是用户手动调close直接destroy了
function listenEvent(sessionid) {
	if (this._sessionHandler[sessionid]) {
		var session = this._sessionHandler[sessionid],
			socket = this._sessionHandler[sessionid]._socket,
			exBuffer = new ExBuffer();	// 2bytes len + [2bytes msgid(base64) + data(protobuf)](bcrypt)
		if (socket) {
			// data use exbuffer
			exBuffer.on('data', function(buffer) {
				this.emit('data', sessionid, buffer);	// 已经切除了包长度，这里应该先解密
			});
			socket.on('data', function(data) {
				exBuffer.put(data);
				session._lasthealth = Date.now();
			});

			socket.on('end', function() {
				console.log('客户端发来了FIN');
				session._lasthealth = Date.now();	// 为什么发来end也要改心跳呢？因为防止刚end就回收了
				session._state = State.SESSION_STATE_CLIENT_END;
			});

			socket.on('error', function(e) {
				console.error('socket error and close socket: ' + e);
			});

			socket.on('close', function() {
				destroy.call(this, sessionid);
			});

			socket.setNoDelay(true);	// 关闭nagle算法
		}
	}
}

Session.prototype.createSession = function(socket) {
	this._sessionid = this._sessionid + 1;
	// sessionid重复
	if (this._sessionHandler[this._sessionid]) {
		// 由于无法创建正确的session，则拒绝客户端连接
		console.log('无法创建正确的session id，拒绝客户端连接');
		socket.destroy();
		return 0;
	}
	this._sessionHandler[this._sessionid] = {
		_state : State.SESSION_STATE_READY,
		_socket : socket,
		_lasthealth : Date.now(),
	};

	listenEvent.call(this, this._sessionid);
	console.log('创建了一个新的socket连接：' + socket.remoteAddress + ' ' + socket.remotePort + ' ' + this._sessionid);
	return this._sessionid;
};

Session.prototype.getSessionID = function() {
	return this._sessionid;
};

Session.prototype.getSessionState = function(sessionid) {
	if (this._sessionHandler[sessionid]) {
		return this._sessionHandler[sessionid]._state;
	}
	return null;
};

Session.prototype.send = function(sessionid, msg) {
	var session,
		len,
		data;
	if (this._sessionHandler.hasOwnProperty(sessionid)) {
		session = this._sessionHandler[sessionid];
		if (session.hasOwnProperty('_socket') && (session._state === State.SESSION_STATE_READY)) {
			// 计算长度，加密
			// bcript
			len = Buffer.byteLength(msg);
			data = new Buffer(2 + len);
			data.fill(len, 0, 2);
			data.fill(msg, 2);
			session._socket.write(data);
		}
	}
};

Session.prototype.close = function(sessionid) {
	destroy.call(this, sessionid);
};
