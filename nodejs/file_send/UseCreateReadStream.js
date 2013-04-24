/**
 * 그냥 통으로 읽는 것 보다야 좋겠지만, 마찬가지로 대용량 파일 전송에 좋지 않다.
 * 버퍼에 그냥 마구 쌓이고 메모리 사용량이 늘어난다.
 * 8GByte를 받는데 메모리에 200Mbyte까지 쌓이는 것을 보고 꺼부렸다. 
 */
var fs = require('fs');
require('http').createServer(function(request, response) {
	response.writeHead(200, {
		'content-type' : 'application/octect'
	});
	fs.createReadStream("test.mkv").addListener("data", function(data) {
		response.write(data);
	}).addListener("close", function() {
		response.end();
	});
}).listen(8080);