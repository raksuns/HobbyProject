/**
 * file로 stream을 만들어 pipe를 사용하면 깔끔하게 끝난다.
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