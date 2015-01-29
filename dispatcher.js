var ProtoBuf = require('protobufjs');


var Proto = require('./proto');
var login = require('./login');
var utils = require('./util/utils');


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

