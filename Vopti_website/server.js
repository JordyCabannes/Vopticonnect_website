// Muaz Khan      - www.MuazKhan.com
// MIT License    - www.WebRTC-Experiment.com/licence
// Documentation  - github.com/muaz-khan/RTCMultiConnection

var serverIP = "192.168.1.22";
var serverPORT = 443;

var isUseHTTPs = !(!!process.env.PORT || !!process.env.IP);
var server = require(isUseHTTPs ? 'https' : 'http'),
    url = require('url'),
    path = require('path'),
    fs = require('fs')
    express = require('express');





/*function serverHandler(request, response) {
    var uri = url.parse(request.url).pathname,
        filename = path.join(process.cwd(), uri);

    var stats;

    try {
        stats = fs.lstatSync(filename);
    } catch (e) {
        response.writeHead(404, {
            'Content-Type': 'text/plain'
        });
        response.write('404 Not Found: ' + path.join('/', uri) + '\n');
        response.end();
        return;
    }

    if (fs.statSync(filename).isDirectory()) {
        response.writeHead(404, {
            'Content-Type': 'text/html'
        });

		
        if (filename.indexOf('/public/') !== -1) {
            filename = filename.replace('/public/', '');
            filename += '/public/index.html';
        } else {
            filename += '/public/index.html';
        }
	
    }


    fs.readFile(filename, 'binary', function(err, file) {
        if (err) {
            response.writeHead(500, {
                'Content-Type': 'text/plain'
            });
            response.write('404 Not Found: ' + path.join('/', uri) + '\n');
            response.end();
            return;
        }

        response.writeHead(200);
        response.write(file, 'binary');
        response.end();
    });
}*/

var app=express();

app.use(express.static(__dirname + '/public'));

var app_bis;



if (isUseHTTPs) {
    var options = {
        key: fs.readFileSync(path.join(__dirname, 'fake-keys/privatekey.pem')),
        cert: fs.readFileSync(path.join(__dirname, 'fake-keys/certificate.pem'))
    };
    app_bis = server.createServer(options, app);
} else app_bis = server.createServer(app);



app_bis = app_bis.listen(process.env.PORT || serverPORT, process.env.IP || serverIP, function() {
    var addr = app_bis.address();
    console.log("Server listening at", addr.address + ":" + addr.port);
});


require('./Signaling-Server.js')(app_bis, function(socket) {
    try {
        var params = socket.handshake.query;

        // "socket" object is totally in your own hands!
        // do whatever you want!

        // in your HTML page, you can access socket as following:
        // connection.socketCustomEvent = 'custom-message';
        // var socket = connection.getSocket();
        // socket.emit(connection.socketCustomEvent, { test: true });

        if (!params.socketCustomEvent) {
            params.socketCustomEvent = 'custom-message';
        }

        socket.on(params.socketCustomEvent, function(message) {
            try {
                socket.broadcast.emit(params.socketCustomEvent, message);
            } catch (e) {}
        });
    } catch (e) {}
});
