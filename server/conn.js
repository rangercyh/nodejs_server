
var net = require('net');

var session = require('./module/session');

var HOST = '10.20.127.197';
var PORT = 8124;

var CHECK_HEALTH_TIME = 5 * 60 * 1000;	// 检查心跳时间

var server = net.createServer(function(socket) {
	console.log('创建了一个新的socket连接：' + socket.remoteAddress + ' ' + socket.remotePort);
	session.createSession(socket);
});

server.listen(PORT, HOST);

server.on('listening', function() {
	console.log('服务器开始监听了：' + server.address().port);
});

server.on('error', function(e) {
	console.error('监听到一个错误：' + e);
});

/* 服务端心跳包维护
心跳包由客户端发送，客户端有两种实现选择，可以直接每隔1min发送一个，
也可以距离上一次正常数据发送后1min才开始发。两种实现对服务端都一样。

服务端在收到心跳包或者正常数据时，都去更新socket列表的lastdata时间戳，
这个时间使用服务器上的时间，因为不信任客户端的时间，然后服务器上设置定时器，
每隔5min（时间可调）检查一下所有的socket列表lastdata，如果发现lastdata距离当前时间超过3min（时间可调），
则认为客户端断线了。同时服务器对客户端的每条协议包括心跳包都需要立刻回复。

客户端无论是发送正常数据还是心跳包，都开启个定时器检查，超时即认为和服务器断开连接，走重连处理
*/
// 据说这个版本的nodejs的interval不稳定，时间有差池而且会积累，待观察
setInterval(function() {
	session.checkHealth();
}, CHECK_HEALTH_TIME);




