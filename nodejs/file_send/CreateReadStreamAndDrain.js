/**
 * �װ� ���ϴ� ���� �����̳�. ����. 
 * ������ �� ������ �����̳�.. 
 * ó�� �ۼ��ϱ�� �ߴ� ���� �������� Ȯ���ϰ�, ������ ����. 
 * request.socket�� ������ pause�� resume�ϰ� �������غ��⵵ �ߴ�. ũũŪ
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