var http = require("http");
var url = require("url");

function start() {

	function onRequest(req, res) {
		res.writeHead(301, {
			Location : 'ya.ru'
		});
		res.end();

	}

	http.createServer(onRequest).listen(8080);
}

exports.start = start;