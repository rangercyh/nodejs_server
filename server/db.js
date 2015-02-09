var Tcp = require('../module/tcp');
var Zmq = require('../module/zmq');


var AllRep = new Zmq('connect', 'rep', 'tcp://10.20.127.197:3009');
AllRep.on('error', function(e) {
	console.error('error:' + e);
});
AllRep.on('msg', function(msg) {

});





