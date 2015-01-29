var crypto = require('crypto');

var Proto = require('../proto');

module.exports.invokeCallback = function(cb) {
	if (!!cb && (typeof cb === 'function')) {
		cb.apply(null, Array.prototype.slice.call(arguments, 1));
	}
};

// 可逆加解密
module.exports.encrypt = function(str, secret) {
	var cipher = crypto.createCipher('aes192', secret),
		encode = cipher.update(str, 'utf8', 'hex');
	encode += cipher.final('hex');
	return encode;
};

module.exports.decrypt = function(str, secret) {
	var decipher = crypto.createDecipher('aes192', secret),
		decode = decipher.update(str, 'hex', 'utf8');
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
	var buffer = protoBuffer.toArrayBuffer(),
		newBuffer = new Buffer(4 + buffer.length);
	newBuffer.write(4 + buffer.length, 0, 2, 'base64');
	newBuffer.write(msgid, 2, 2, 'base64');
	newBuffer.fill(buffer, 4);
	return newBuffer;
};

/*
result : true or false
*/
module.exports.createSimpleResult = function(requestType, result) {
	var Builder = Proto.getBuilder("boolresult"),
		data,
		msgid;
	if (typeof Builder === "function") {
		data = new Builder();
		data.requestid = requestType;
		data.result = result;
		msgid = Proto.getMsgid("boolresult");
		if (msgid) {
			return module.exports.encodeBuffer(data, msgid);
		}
	}

	return null;
};
