var ProtoBuf = require('protobufjs');

// 定义之前先检查是否有相同的字符串
_MsgTable = {
	"boolresult" : 1,
	"register" : 2,
	"auth" : 3
};

var _builder = null;

module.exports.getMsgid = function(msgname) {
	if (_MsgTable[msgname]) {
		return _MsgTable[msgname];
	}
	return null;
};

module.exports.getMsgName = function(msgid) {
	for (name in _MsgTable) {
		if (_MsgTable[name] == msgid) {
			return name;
		}
	}
	return null;
};

module.exports.getBuilder = function(name) {
	if (!_builder) {
		var builder = ProtoBuf.loadProtoFile('proto/dispatcher.proto');
		for (name in _MsgTable) {
			_builder[name] = builder.build(name);
		}
	}
	return _builder[name];
};




