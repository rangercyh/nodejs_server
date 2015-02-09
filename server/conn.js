
var Tcp = require('../module/tcp');
var Zmq = require('../module/zmq');
var State = require('../module/const').CONN_PLAYER_STATE;


var g_Player = {};
/*
[sessionid] : {
	uuid:
	loginTime:
	playerid:
	state:
}
*/

var GateConnRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3001');
GateConnRep.on('error', function(e) {
	console.error('error:' + e);
});
GateConnRep.on('msg', function(msg) {

});

var ConnLocReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3002');
ConnLocReq.on('error', function(e) {
	console.error('error:' + e);
});
ConnLocReq.on('msg', function(msg) {

});

var ConnChatReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3004');
ConnChatReq.on('error', function(e) {
	console.error('error:' + e);
});
ConnChatReq.on('msg', function(msg) {

});

var ConnMailReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3006');
ConnMailReq.on('error', function(e) {
	console.error('error:' + e);
});
ConnMailReq.on('msg', function(msg) {

});

var ConnChatRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3014');
ConnChatRep.on('error', function(e) {
	console.error('error:' + e);
});
ConnChatRep.on('msg', function(msg) {

});

var ConnMailRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3016');
ConnMailRep.on('error', function(e) {
	console.error('error:' + e);
});
ConnMailRep.on('msg', function(msg) {

});


var ClientTcp = new Tcp("10.20.127.197", 5000);
ClientTcp.on('error', function(e) {
	console.error('error:' + e);
});
ClientTcp.on('connection', function(sessionid) {
	if (g_Player.hasOwnProperty(sessionid)) {
		// 处理session冲突
		// 把原player数据清除
	}
	g_Player[sessionid] = {
		uuid : '',
		loginTime : 0,
		playerid : 0,
		state : State.IDLE
	};
});
ClientTcp.on('destroy', function(sessionid) {
	if (g_Handler.hasOwnProperty(sessionid)) {
		// 处理player信息
		delete g_Handler[sessionid];
	}
});
ClientTcp.on('data', function(id, msgid, protoData) {
	if (g_Handler.hasOwnProperty(id)) {
		// 分发消息
	}
});




