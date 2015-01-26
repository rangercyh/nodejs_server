


var ProtoBuf = require('protobufjs');
var ProtocolName = require('protoname');
var ProtoBuilder = require('protobuilder');
var login = require('login');


var dispatchTable = {
	"register" : login.register,
	"auth" : login.auth
}

function dispatcher(data, msgid, socket) {
	var msgName = ProtocolName[msgid];
	if (msgName && ProtoBuilder[msgName]) {
		var msg = ProtoBuilder[msgName].decode(data);
		dispatchTable[msgName](msg, socket);
	}
};

module.exports = dispatcher;

