var crypto = require('crypto');

var Proto = require('../proto');

module.exports.invokeCallback = function(cb) {
	if (!!cb && (typeof cb === 'function')) {
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
};

// 可逆加解密
module.exports.encrypt = function(str, secret) {
	var cipher = crypto.createCipher('aes192', secret);
	var encode = cipher.update(str, 'utf8', 'hex');
	encode += cipher.final('hex');
	return encode;
};

module.exports.decrypt = function(str, secret) {
	var decipher = crypto.createDecipher('aes192', secret);
	var decode = decipher.update(str, 'hex', 'utf8');
	decode += decipher.final('utf8');
	return decode;
};

module.exports.md5 = function(str) {
	var md5sum = crypto.createHash('md5');
	md5sum.update(str);
	str = md5sum.digest('hex');
	return str;
};

/*
protoBuffer : proto对象
msgid : message的编号
调用者保证均不为空
*/
module.exports.encodeBuffer = function(protoBuffer, msgid) {
	var buffer = protoBuffer.toArrayBuffer();
	var newBuffer = new Buffer(4 + buffer.length);
	newBuffer.write(4 + buffer.length, 0, 2, 'base64');
	newBuffer.write(msgid, 2, 2, 'base64');
	newBuffer.fill(buffer, 4);
	return newBuffer;
};

/*
result : true or false
*/
module.exports.createBoolResult = function(requestid, result) {
	var builder = Proto.getBuilder("boolresult");
	var data = new builder;
	data.requestid = requestid;
	data.result = result;
	var msgid = Proto.getMsgid("boolresult");
	if (msgid) {
		var buffer = module.exports.encodeBuffer(data, msgid);
		return buffer;
	}
	return null;
};
