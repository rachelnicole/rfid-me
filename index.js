var SerialPort = require("serialport");
var portaddr = "/dev/cu.usbmodem1421";
var port = new SerialPort(portaddr, {
  baudRate: 115200,
  parser: SerialPort.parsers.readline('\n')
});
var http = require('http');
var express = require('express');
var app = module.exports.app = express();
//Middleware
var server = http.createServer(app);
var io = require('socket.io').listen(server);  //pass a http.Server instance

app.use('/public', express.static('public'));

app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

var deniedText = "<p class=\"access denied\">access denied</p>";
var grantedText = "<p class=\"access granted\">access granted</p>";

port.on('open', function() {
  console.log('Opened port');
  port.on('data', function(text) {
    var data = JSON.parse(text);
    var type = data[0];
    switch (type) {
      case 'init':
        rfidInitialized();
        break;
      case 'found':
        rfidFound(data[1].toString(16));
        break;
      case 'type':
        rfidType(data[2].toString(16) + data[1].toString(16));
        break;
      case 'serial':
        rfidSerial(data[2].toString(16) + ':' + data[3].toString(16) + ':' + data[4].toString(16));
        break;
    }
  });
  port.on('error', function(err) {
    console.log('Error: ', err.message);
  });
});

function rfidInitialized() {
  console.log('initialized');
}

function rfidFound(version) {
  console.log('found firmware ' + version);
}

function rfidType(type) {
  console.log('tag type ' + type);
}

function rfidSerial(serial) {
  console.log('serial ' + serial);
  if (serial !== '4:38:2') { 
    console.log('access denied');
    io.sockets.emit("access", deniedText);
  }
  else {
    console.log('access granted');
    io.sockets.emit("access", grantedText);
  }
}

server.listen(3030);