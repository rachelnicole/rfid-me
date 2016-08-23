var SerialPort = require("serialport");
var portaddr = "/dev/cu.usbmodem1421";
var port = new SerialPort(portaddr, {
  baudRate: 115200,
  parser: SerialPort.parsers.raw
});
var sys = require('util');
var fs = require('fs');
// Stores the RFID id as it reconstructs from the stream.
var id = '';
// List of all RFID ids read
var ids = [];

port.on('open', function() {
  console.log('Opened port');
  port.on('data', function (data) {
    process.stdout.write(data);
  });
  port.on('error', function(err) {
    console.log('Error: ', err.message);
  });
})

