var ProtocolName = require('protoname');

var _builder;


function init() {
	if (!_builder) {
		var builder = ProtoBuf.loadProtoFile('proto/dispatcher.proto');
		for each (name in ProtocolName) {
			_builder[name] = builder.build(name);
		}
	}
	return _builder;
}

module.exports = init;
