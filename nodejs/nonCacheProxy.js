/**
 * http://50ndd1n6.tistory.com/entry/nodejs-%ED%94%84%EB%A1%9D%EC%8B%9C-%EC%97%B0%EC%8A%B5
 * node.js로 작성해 본 프록시 예제입니다.
 * non-cache 프록시겠죠.
 * 필터링 등의 용도나 작성한 스크립트를 자동으로 모든 문서에 삽입할 수 있게 
 * 다음과 같은 기본 구조에서 변경할까 합니다. 
 * 
 * 윈도우에서 간혹 속력이 느리다면, nameserver를 자신의 isp에 맞는 것으로 바꾸면 됩니다.
 * 문제 없이 안정적으로 잘 작동하는 듯 하네요.
 * 은행 등에서 따로 보안을 요하는 곳에서는 추가되는 스크립트 파일들이 변경된 것인지를 서명을 통해 검사하고
 * 그러하지 않으면 실행되지 않기에, 일괄처리 이전에 예외를 두어 이를 고려해야겠죠.
 * 
 * http.request 대신 https.request를 사용하면 https의 클라이언트로 이용할 수 있습니다
 */
var http = require('http');
var url  = require('url');

var server = http.createServer(function(request, response) {
	var temp = url.parse(request.url);
	var headers = {};
	
	for (var i in request.headers) {
		headers[i] = request.headers[i];
	}
	
	headers['connection'] = headers['proxy-connection'];
	
	delete headers['proxy-connection'];
	
	var option = {
		host : temp.hostname,
		port : temp.port || 80,
		path : temp.href.split(temp.host)[1],
		method : request.method,
		headers : headers
	};
	
	http.getAgent(option.host, option.port).maxSockets = 50;
	
	var client = http.request(option, function(res) {
		response.writeHead(res.statusCode, '', res.headers);
		
		res.on('data', function(chunk) {
			response.write(chunk);
		});
		
		res.on('end',  function() {
			response.end();
		});
	});
	
	request.on('data', function(chunk) {
		client.write(chunk);
	});
	
	request.on('end',  function() {
		client.end();
	});
	
	client.on('error', function() {
		response.end();
	});
	
	client.end();
});

server.listen(1000);
server.on('error', Function());