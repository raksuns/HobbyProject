/**
 * http://50ndd1n6.tistory.com/entry/nodejs-%ED%94%84%EB%A1%9D%EC%8B%9C-%EC%97%B0%EC%8A%B5
 * node.js�� �ۼ��� �� ���Ͻ� �����Դϴ�.
 * non-cache ���Ͻð���.
 * ���͸� ���� �뵵�� �ۼ��� ��ũ��Ʈ�� �ڵ����� ��� ������ ������ �� �ְ� 
 * ������ ���� �⺻ �������� �����ұ� �մϴ�. 
 * 
 * �����쿡�� ��Ȥ �ӷ��� �����ٸ�, nameserver�� �ڽ��� isp�� �´� ������ �ٲٸ� �˴ϴ�.
 * ���� ���� ���������� �� �۵��ϴ� �� �ϳ׿�.
 * ���� ��� ���� ������ ���ϴ� �������� �߰��Ǵ� ��ũ��Ʈ ���ϵ��� ����� �������� ������ ���� �˻��ϰ�
 * �׷����� ������ ������� �ʱ⿡, �ϰ�ó�� ������ ���ܸ� �ξ� �̸� ����ؾ߰���.
 * 
 * http.request ��� https.request�� ����ϸ� https�� Ŭ���̾�Ʈ�� �̿��� �� �ֽ��ϴ�
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