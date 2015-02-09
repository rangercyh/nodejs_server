var Tcp = require('../module/tcp');
var Zmq = require('../module/zmq');


var g_Handler = {};
/*
[sessionid] : {
	uuid:
	connectTime:
}
*/

var ClientTcp = new Tcp("10.20.127.197", 4000);
ClientTcp.on('error', function(e) {
	console.error('error:' + e);
});
ClientTcp.on('connection', function(sessionid) {
	if (g_Handler.hasOwnProperty(sessionid)) {
		// 处理session冲突
		// 把原hander数据清除
	}
	g_Handler[sessionid] = {
		uuid : '',
		connectTime : Date.now()
	};
});
ClientTcp.on('destroy', function(sessionid) {
	if (g_Handler.hasOwnProperty(sessionid)) {
		// 处理原hander信息
		delete g_Handler[sessionid];
	}
});
ClientTcp.on('data', function(id, msgid, protoData) {
	if (g_Handler.hasOwnProperty(id)) {
		// 分发消息
	}
});

var GateConnReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3000');
GateConnReq.on('error', function(e) {
	console.error('error:' + e);
});
GateConnReq.on('msg', function(msg) {

});





