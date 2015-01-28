var ProtoBuf = require('protobufjs');


var Proto = require('./proto');
var login = require('./login');
var utils = require('./util/utils');


var dispatchTable = {
	"register" : login.register,
	"auth" : login.auth
};

function dispatcher(data, msgid, socket) {
	var msgName = Proto.getMsgName(msgid),
		msgBuilder = Proto.getBuilder(msgName),
		backMsg = null;
	if (msgName && msgBuilder) {
		if (dispatchTable[msgName]) {
			backMsg = dispatchTable[msgName](msgBuilder.decode(data));
		}
	}

	if (backMsg) {
		socket.write(backMsg);
	} else {
		// 对于不合理的情况一律回一个false
		socket.write(utils.createSimpleResult(msgid, false));
	}
}

module.exports = dispatcher;

