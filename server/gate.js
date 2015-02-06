var Tcp = require('../module/connect').Tcp;
var Zmq = require('../module/connect').Zmq;
var EventEmitter = require('events').EventEmitter;
var util = require('util');


function listenEvents() {
	this.ClientTcp.on('error', function(e) {
		console.error('error:' + e);
	});

	this.ClientTcp.on('connection', function(sessionid) {
		this.g_Handler
	});

	this.ClientTcp.on('data', function(msgid, protoData) {

	});


	this.ConnZmq.on('error', function(e) {
		console.error('error:' + e);
	});

	this.ConnZmq.on('msg', function(msg) {

	});
}

var gate = function(host, port) {
	this.g_Handler = {};
		/*
		[sessionid] : {
			uuid:
			connectTime:
		}
		*/
	this.ClientTcp = new Tcp(host, port);
	this.ConnZmq = new Zmq('bind', 'req', 'tcp://10.20.127.197:3000');

	EventEmitter.call(this);

	listenEvents.call(this);
};

util.inherits(gate, EventEmitter);

module.exports = gate;



