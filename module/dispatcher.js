var ProtoBuf = require('protobufjs');

var Proto = require('./proto');
var login = require('./login');
var utils = require('./utils');

/*
消息分发器模块
设计的原则是由于所有的进程都会引用这个模块，所以分发器按照模块的name来区分可以处理的消息
*/
var dispatchTable = {
	"register" : login.register,
	"auth" : login.auth,
	"reconnect" : login.reconnect
};

function dispatcher(data, msgid, _sessionid) {
	var msgName = Proto.getMsgName(msgid),
		msgBuilder = Proto.getBuilder(msgName);
	if (msgName && msgBuilder) {
		if (dispatchTable[msgName]) {
			dispatchTable[msgName](_sessionid, msgBuilder.decode(data), msgid);
		}
	}
}

module.exports = dispatcher;

