/**
 * �׳� ������ �д� �� ���پ� ��������, ���������� ��뷮 ���� ���ۿ� ���� �ʴ�.
 * ���ۿ� �׳� ���� ���̰� �޸� ��뷮�� �þ��.
 * 8GByte�� �޴µ� �޸𸮿� 200Mbyte���� ���̴� ���� ���� ���ηȴ�. 
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