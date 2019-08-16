var http = require('http');
var app = require('./app');
var port = process.env.PORT || 4000;
var server = http.createServer(app);
server.listen(port);
//# sourceMappingURL=server.js.map