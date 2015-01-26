var ProtoBuf = require('protobufjs');


var Proto = require('./proto');
var login = require('./login');
var utils = require('./util/utils');


var dispatchTable = {
	"register" : login.register,
	"auth" : login.auth
}

function dispatcher(data, msgid, socket) {
	var msgName = Proto.getMsgName(msgid);
	var msgBuilder = Proto.getBuilder(msgName);
	if (msgName && msgBuilder) {
		if (dispatchTable[msgName]) {
			var msg = msgBuilder.decode(data);
			dispatchTable[msgName](msg, socket);
			return;
		}
	}
	// 对于不合理的情况一律回一个false
	var result = utils.createBoolResult(msgid, false);
	if (result) {
		socket.write(result);
	}
};

module.exports = dispatcher;

