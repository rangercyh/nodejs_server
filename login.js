var mysql = require('database/db').init();
var ProtoBuilder = require('protobuilder');
var ProtoMap = require('protomap');
var utils = require('util/utils');

module.exports.register = function(data, socket) {
	if (data.username && data.password) {
		// 检查合法性
		var data = new ProtoBuilder["result"];
		data.result = false;
		var buffer = utils.encodeBuffer(data, ProtoMap.COMMON_RETURN);
		socket.write(buffer);
	}
};

module.exports.auth = function() {

};
