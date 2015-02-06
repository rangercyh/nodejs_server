// 构造连接
/*
目前连接主要有两类，一类是和客户端的连接，另一类是后端服务器间的连接
客户端的连接可以使用原生tcp或者zmq，后端服务器连接使用zmq（都是推荐）
消息msgid和数据的组装和拆分在这里做
TCP抛出消息：connection、error、data
ZMQ抛出消息：error、msg
*/
var net = require('net');
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var zmq = require('zmq');

var Session = require('./session');


var _Tcp = function(ip, port) {
	this.session = new Session();

	var server = net.createServer();
	server.on('connection', function(socket) {
		var id = this.session.createSession(socket);
		if (id !== 0) {
			this.emit('connection', id);
		}
	});

	server.on('listening', function() {
		console.log('服务器开始监听了：' + server.address().port);
	});

	server.on('error', function(e) {
		//console.error('监听到一个错误：' + e);
		this.emit('error', e);
	});

	server.listen(port, ip);

	this.session.on('destroy', function(sessionid) {
		console.log('一个client走了：' + sessionid);
	});

	this.session.on('data', function(msg) {
		// 切开msgid和data，这里的数据应该已经由session模块解密了
		this.emit('data', msg.toString('base64', 0, 2), msg.slice(2));
	});

	EventEmitter.call(this);
};

var _Zmq = function(type, zmqType, address) {
	var connect = zmq.socket(zmqType);
	if (type === 'bind') {
		connect.bindSync(address);
	} else {
		connect.connect(address);
	}
	connect.on('message', function(msg) {
		this.emit('msg', msg);
	});

	EventEmitter.call(this);
};

util.inherits(_Tcp, EventEmitter);
util.inherits(_Zmq, EventEmitter);

module.exports.Tcp = _Tcp;
module.exports.Zmq = _Zmq;

_Tcp.prototype.closeClient = function(id) {
	this.session.close(id);
};

_Tcp.prototype.send = function(id, msg, msgid) {
	var len = Buffer.byteLength(msg),
		data = new Buffer(2 + len);
	data.write(msgid, 0, 2, 'base64');
	data.fill(msg, 2);
	this.session.send(id, data);
};

