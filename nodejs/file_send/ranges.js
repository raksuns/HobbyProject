/**
 * �̾�ޱ�(�κ� �ޱ�) ��û ó��
 * MSDN�� ���ϸ� Accept-Ranges�� UA���� �ٽ� ���� ������ �ٿ�ε带 �������� �˷� �شٰ� �Ѵ�.
 * �� 40�� �ۿ� �ȵǴ� ����� ���� ����� �Ǵ�. Ȥ�ó� �ؼ� �ؽ����� ���غ��� �ߴ�.
 * ���� �ʹ� �ظ��.
 * �׷��� ����2���� fd ����� �������� �ϰ� ������ ���� pipe�� ����� �� �Ӹ� �ƴ϶�, 
 * �Ϲ����� response.write�� ����ϴ� �͵� drain�̺�Ʈ�� �̿��� �ִ� �ӷ��� ������ �� �ִ� ���ɼ��� �����ش�.
 * �ٸ� write�� �ϱ����� �޸�(�Ǵ� ����)�� �̹� ��� �÷����ų� ���ų��� �ۼ��ڿ��� �޷� �ִ�.
 * �� �׸��� ������ ����� .pipe(response.socket)�� �ƴ� .pipe(response)�� ����Ͽ���.
 * �̰��� ū ���̴� chunk ���ڵ��� ó���� �ִ�.
 * socket�� ���� ����ϰ� �Ǵ� ���, �⺻������ node.js���� ���Ǵ� chunk ������ ����� ������ �߻��ϰ� �ȴ�.
 * response�� ����ϸ� �˾Ƽ� �� ����� ���� ���۵ȴ�.
 */

var fs = require('fs');

require('http').createServer(function(request, response) {
	var filename = "test.avi";
	var fileLength = fs.statSync(filename).size;
	var resHeaders = {
		'content-type' : 'application/octet',
		'content-length' : fileLength,
		'accept-ranges' : 'bytes'
	};
	
	var code = 200;
	if (request.headers['range']) {     
        var value = request.headers['range'].split('=')[1].split('-'); 
        var start = Number(value[0] || 0);
        var end   = Number(value[1] || fileLength);
        resHeaders['accept-ranges']  = 'bytes';
        resHeaders['content-length'] = end - start; 
        resHeaders['content-range']  = 'bytes ' + start + '-' + end + '/' + fileLength;
        code = 206;
        console.log(resHeaders);
    };
    
    var MAX = 5500 * 1024; // bytes in a second
    response.writeHead(code, resHeaders);
    response.on('pipe', function(source) {
        if (!MAX) return false;
        var START = Date.parse(new Date()); 
        var TOTAL = 0;
        source.on('data', function(data) {
            TOTAL += data.length;
            var duration = Date.parse(new Date()) - START;
            if ((TOTAL/(duration||1))*1000 > MAX) {
                source.pause();
                setTimeout(
                    function(){source.resume();}, 
                    Math.ceil((TOTAL*1000)/MAX-duration)
                );
            }
        });
    });
    fs.createReadStream(filename, {start:start, end: end}).pipe(response);  
}).listen(8080);