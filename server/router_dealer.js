var zmq = require('zmq');

var config = [
	[3000, 3001],	// gate-conn
	[3002, 3003],	// conn-loc
	[3004, 3005],	// conn-chat
	[3006, 3007],	// conn-mail
	[3008, 3009],	// loc,chat,mail-db
	[3010, 3011],	// loc-chat
	[3012, 3013],	// loc-mail
	[3014, 3015],	// chat-conn
	[3016, 3017]	// mail-conn
];
var i, router, dealer;

for (i in config) {
	if (config.hasOwnProperty(i)) {
		router = zmq.socket('router');
		router.bindSync('tcp://*:' + config[i][0]);
		dealer = zmq.socket('dealer');
		dealer.bindSync('tcp://*:' + config[i][1]);
		zmq.proxy(router, dealer);
	}
}
