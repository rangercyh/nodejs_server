var Tcp = require('../module/tcp');
var Zmq = require('../module/zmq');


var ChatConnRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3005');
ChatConnRep.on('error', function(e) {
	console.error('error:' + e);
});
ChatConnRep.on('msg', function(msg) {

});


var ChatDbReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3008');
ChatDbReq.on('error', function(e) {
	console.error('error:' + e);
});
ChatDbReq.on('msg', function(msg) {

});


var ChatLocRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3011');
ChatLocRep.on('error', function(e) {
	console.error('error:' + e);
});
ChatLocRep.on('msg', function(msg) {

});


var ChatConnReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3014');
ChatConnReq.on('error', function(e) {
	console.error('error:' + e);
});
ChatConnReq.on('msg', function(msg) {

});




