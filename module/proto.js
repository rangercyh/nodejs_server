var ProtoBuf = require('protobufjs');

// 定义之前先检查是否有相同的字符串
var _MsgTable = {
	"boolresult" : 1,
	"login" : 2,
};

var _builder;

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
		builder,
		allBuilder;
	if (!_builder) {
		_builder = {};
		builder = ProtoBuf.loadProtoFile('proto/dispatcher.proto');
		if (builder) {
			allBuilder = builder.build("dispatcher");
			console.log(allBuilder);
			for (builderName in _MsgTable) {
				if (_MsgTable.hasOwnProperty(builderName)) {
					_builder[builderName] = allBuilder[builderName];
				}
			}
		}
	}
	if (_builder.hasOwnProperty(name)) {
		return _builder[name];
	}
	return null;
};


