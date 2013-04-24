/**
 * 네가 원하는 것이 무엇이냐. 으응. 
 * 지구에 온 목적이 무엇이냐.. 
 * 처음 작성하기로 했던 것이 뻘짓임을 확인하고, 남겨진 흔적. 
 * request.socket을 가져와 pause와 resume하고 별짓다해보기도 했다. 크크큭
 */
var fs = require('fs');
require('http').createServer(function(request, response) {
	var filename = "test.mkv";
	var resHeaders = {
		'content-type' : 'applcation/octet',
		'content-length' : fs.statSync(filename).size,
		'accept-ranges' : 'bytes'
	};
	
	response.writeHead(200, resHeaders);
	
	response.socket.on('drain', function() {
		downStream.resume();
	});
	
	var downStream = fs.createReadStream(filename);
	
	downStream.on("data", function(data) {
		if (!response.write(data))
			downStream.pause();
	}).on("close", function() {
		response.end();
	});
}).listen(8080);