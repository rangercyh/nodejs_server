var ProtoBuf = require('protobufjs');

// 定义之前先检查是否有相同的字符串
var _MsgTable = {
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
	var name;
	for (name in _MsgTable) {
		if ((_MsgTable.hasOwnProperty(name)) && (_MsgTable[name] === msgid)) {
			return name;
		}
	}
	return null;
};

module.exports.getBuilder = function(name) {
	var builderName,
		builder;
	if (!_builder) {
		builder = ProtoBuf.loadProtoFile('proto/dispatcher.proto');
		for (builderName in _MsgTable) {
			if (_MsgTable.hasOwnProperty(builderName)) {
				_builder[builderName] = builder.build(builderName);
			}
		}
	}
	return _builder[name];
};


