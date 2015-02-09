var Tcp = require('../module/tcp');
var Zmq = require('../module/zmq');


var LocConnRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3003');
LocConnRep.on('error', function(e) {
	console.error('error:' + e);
});
LocConnRep.on('msg', function(msg) {

});


var LocDbReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3008');
LocDbReq.on('error', function(e) {
	console.error('error:' + e);
});
LocDbReq.on('msg', function(msg) {

});


var LocChatReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3010');
LocChatReq.on('error', function(e) {
	console.error('error:' + e);
});
LocChatReq.on('msg', function(msg) {

});


var LocMailReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3012');
LocMailReq.on('error', function(e) {
	console.error('error:' + e);
});
LocMailReq.on('msg', function(msg) {

});




