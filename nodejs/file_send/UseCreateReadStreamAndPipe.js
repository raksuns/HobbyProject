/**
 * file�� stream�� ����� pipe�� ����ϸ� ����ϰ� ������.
 */
var fs = require('fs');
require('http').createServer(function(request, response) {
	var filename = "test.avi";
	var resHeaders = {
		'content-type' : 'applcation/octet',
		'content-length' : fs.statSync(filename).size,
		'accept-ranges' : 'bytes'
	};
	
	response.writeHead(200, resHeaders);
	
	fs.createReadStream(filename).pipe(response);
	
}).listen(8080);