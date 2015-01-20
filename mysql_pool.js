var mysql = require('mysql');

var MYSQL_HOST = '10.20.123.70';

exports.createMysqlPool = function () {
	return mysql.createPool({
		host : MYSQL_HOST,
		user : 'caiyiheng',
		password : 'caiyiheng',
		database : 'demo',
		connectionLimit : 10
	});
};
