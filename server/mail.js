var Tcp = require('../module/tcp');
var Zmq = require('../module/zmq');


var MailConnRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3007');
MailConnRep.on('error', function(e) {
	console.error('error:' + e);
});
MailConnRep.on('msg', function(msg) {

});


var MailDbReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3008');
MailDbReq.on('error', function(e) {
	console.error('error:' + e);
});
MailDbReq.on('msg', function(msg) {

});


var MailLocRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3013');
MailLocRep.on('error', function(e) {
	console.error('error:' + e);
});
MailLocRep.on('msg', function(msg) {

});


var MailConnReq = new Zmq('connect', 'req', 'tcp://10.20.127.197:3016');
MailConnReq.on('error', function(e) {
	console.error('error:' + e);
});
MailConnReq.on('msg', function(msg) {

});




