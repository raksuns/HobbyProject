http.ServerResponse.prototype.writeFile = function(filename, option) {
    var MAX = this.speed || this.server.downloadSpeed ;
    if (MAX) {
        this.on('pipe', function(source) {
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
    };
    fs.createReadStream(filename, option).pipe(this);
    return this;
};