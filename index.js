var SerialPort = require("serialport");
var portaddr = "/dev/cu.usbmodem1421";
var port = new SerialPort(portaddr, {
  baudRate: 115200,
  parser: SerialPort.parsers.readline('\n')
});
var sys = require('util');

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
}
