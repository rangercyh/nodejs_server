var mysql = require('./database/db').init();
var utils = require('./utils');
var session = require('./session');




// var obj = JSON.parse(data.toString());
// console.log('收到数据：' + data);
// console.log(obj['username'] + ' ' + obj['password']);

// var sql = 'select * from userinfo where username = ?'
// mysql.query(sql, [obj['username']], function (err, result, fields) {
// 	if (err !== null) {
// 		console.error('error :');
// 		console.error(err.code);
// 		console.error(err.fatal);
// 		console.error(err.stack);
// 	} else {
// 		var auth = false;
// 		if (result.length > 0) {
// 			var password = result[0].password;
// 			if (password === obj['password']) {
// 				auth = true;
// 			}
// 		}
// 		console.log('查出了数据');
// 		socket.write(JSON.stringify({type:2,data:auth}));
// 	}
// });


module.exports.register = function(sessionid, msg, msgid) {
	if (msg.hasOwnProperty('username') && msg.hasOwnProperty('password')) {
		// 检查合法性
	}

};

module.exports.auth = function(sessionid, msg, msgid) {
	// 参数合法性检查
};

module.exports.reconnect = function(sessionid, msg, msgid) {
	var result = false,
		backMsg;
	if (msg.hasOwnProperty("username")) {
		// 参数合法性检查
		result = session.reConnect(sessionid, msg.username);
	}
	backMsg = utils.createSimpleResult(msgid, result);
	session.send(backMsg);
};
