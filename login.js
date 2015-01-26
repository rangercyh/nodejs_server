var mysql = require('database/db').init();
var ProtoBuilder = require('protobuilder');
var ProtoMap = require('protomap');
var utils = require('util/utils');




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
