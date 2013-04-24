/**
 * 이어받기(부분 받기) 요청 처리
 * MSDN에 의하면 Accept-Ranges가 UA에게 다시 시작 가능한 다운로드를 지원함을 알려 준다고 한다.
 * 딱 40줄 밖에 안되는 결과에 비해 고생이 컸다. 혹시나 해서 해쉬값도 비교해보고 했다.
 * 몰라서 너무 해멨다.
 * 그러나 연습2에서 fd 사용을 별론으로 하고 파일을 직접 pipe를 사용한 것 뿐만 아니라, 
 * 일반적인 response.write를 사용하는 것도 drain이벤트를 이용해 최대 속력을 설정할 수 있는 가능성을 보여준다.
 * 다만 write를 하기전에 메모리(또는 버퍼)에 이미 모두 올려놓거나 말거나는 작성자에게 달려 있다.
 * 아 그리고 실험한 결과로 .pipe(response.socket)이 아닌 .pipe(response)를 사용하였다.
 * 이것의 큰 차이는 chunk 인코딩의 처리에 있다.
 * socket을 직접 사용하게 되는 경우, 기본적으로 node.js에서 사용되는 chunk 형식의 헤더에 문제가 발생하게 된다.
 * response를 사용하면 알아서 잘 헤더에 따라 동작된다.
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