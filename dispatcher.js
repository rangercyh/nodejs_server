

/*
var obj = JSON.parse(data.toString());
console.log('收到数据：' + data);
console.log(obj['username'] + ' ' + obj['password']);

var sql = 'select * from userinfo where username = ?'
mysql.query(sql, [obj['username']], function (err, result, fields) {
	if (err !== null) {
		console.error('error :');
		console.error(err.code);
		console.error(err.fatal);
		console.error(err.stack);
	} else {
		var auth = false;
		if (result.length > 0) {
			var password = result[0].password;
			if (password === obj['password']) {
				auth = true;
			}
		}
		console.log('查出了数据');
		socket.write(JSON.stringify({type:2,data:auth}));
	}
});
*/


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

