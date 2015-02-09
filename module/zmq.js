// 构造连接
/*
目前连接主要有两类，一类是和客户端的连接，另一类是后端服务器间的连接
客户端的连接可以使用原生tcp或者zmq，后端服务器连接使用zmq（都是推荐）
消息msgid和数据的组装和拆分在这里做
TCP抛出消息：connection、error、data
ZMQ抛出消息：error、msg
*/
var EventEmitter = require('events').EventEmitter;
var util = require('util');
var zmq = require('zmq');


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


util.inherits(_Zmq, EventEmitter);


module.exports = _Zmq;



