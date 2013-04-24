/**
 * �ִ� ���� �ӵ��� ����
 * ó�� PHP�� �ִ� ������ ���� interval�� sleepó��, buffer ũ�� ������ �ӷ��� �����ϴ� ����� ���� ��������µ�... 
 * �׷� �ʿ䰡 ������. �ٽ� ��� ���. 
 * �ڿ������� �߻��Ǵ� data �̺�Ʈ���� �˻縦 �ϰ� timeout�� �̿��� 
 * interval�� ���� ���� ������ ���̰� buffer�� �������, 
 * ���� ���(?)��������, �ڵ尡 �� �������� �������� ���� �̾�.....
 * �̶��� source ��Ʈ���� �ڽ��� pipe�� ����� ����Ų��.
 * ��� ��Ʈ�� ������ ������ �������� �ʾ����� �̷��� ������ �ҷ��� �� ���� �ִ�. 
 */
var fs = require('fs');
require('http').createServer( function(request, response) {
    var filename = "test.avi";
    var resHeaders = {
        'content-type'   : 'applcation/octet',
        'content-length' : fs.statSync(filename).size,
        'accept-ranges'  : 'bytes'
    };  
    var MAX = 3000 * 1024; // bytes in a second
    response.writeHead(200, resHeaders);
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
                    function(){
                    	source.resume();
                    }, 
                    Math.ceil((TOTAL*1000)/MAX-duration)
                );
            }
        });
    });
    fs.createReadStream(filename).pipe(response);   
}).listen(8080);