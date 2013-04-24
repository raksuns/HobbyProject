/**
 * 최대 전송 속도의 제한
 * 처음 PHP에 있던 예제를 보고 interval을 sleep처럼, buffer 크기 조절로 속력을 제한하는 방식을 따라 만들었었는데... 
 * 그럴 필요가 없었다. 다시 모두 폐기. 
 * 자연스럽게 발생되는 data 이벤트에서 검사를 하고 timeout을 이용해 
 * interval로 있을 실행 간격을 줄이고 buffer에 상관없게, 
 * 좀더 우아(?)해졌으나, 코드가 좀 가독성이 떨어지는 것이 미안.....
 * 이때의 source 스트림은 자신을 pipe한 대상을 가리킨다.
 * 비록 스트림 생성시 변수를 설정하지 않았지만 이렇게 역으로 불러와 쓸 수가 있다. 
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