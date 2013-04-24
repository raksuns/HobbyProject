/**
 * 단 보내는 평범 최대 속력, 병목(response.write의 반환 false)이 발생시 중지했다가 버퍼가 비워지면﻿(drain 이벤트)  다시 업한다.
 * - response.write의 반환 값으로  병목 검사 (병목시, false 반환), 병목시 write 중지
 * - 병목으로 인한 쌓인 버퍼가 비워지면 drain 이벤트 발생 -> 다시 writeFile 함수 시작
 * - bytesRead 는 모두 읽게된 경우 0을 반환, while에서 사용 (0 == false)
 * - 크롬의 다운로드 중지에 적절하게 대응하나(연결 유지), FF는 이어 받기 처리를 위해서는 새로운 request 처리가 필요하다.
 */
var fs = require('fs');
require('http').createServer(function(request, response) {
	var filename = "test.mkv";
	var resHeaders = {
		'content-type' : 'applcation/octet',
		'content-length' : fs.statSync(filename).size,
		'accept-ranges' : 'bytes'
	};
	var fd = fs.openSync(filename, 'r');
	var writeFile = function() {
		var bytesRead = true;
		var buffer = new Buffer(1024 * 64); // 64Kbyte
		while (bytesRead) {
			bytesRead = fs.readSync(fd, buffer, 0, buffer.length, null);
			if (!response.write(buffer, 'binary'))
				return;
		}
		response.end();
	};
	
	response.writeHead(200, resHeaders);
	
	writeFile();
	
	response.socket.on('drain', function() {
		writeFile();
	});
	
}).listen(8080);