var SerialPort = require("serialport");
var port = new SerialPort("/dev/cu.usbmodem1421", {
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
  port.write('main screen turn on', function(err) {
    if (err) {
      return console.log('Error on write: ', err.message);
    }
    console.log('message written');
  });
});

port.on('data', function (data) {
  console.log('Data: ' + data);
});

// port.on('data', function (data) {
//   console.log('hi im here');
//   console.log(data);
//   data = data.toString('ascii').match(/\w*/)[0]; // Only keep hex chars
//   if ( data.length == 0 ) { // Found non-hex char
//     if ( id.length > 0 ) { // The ID isn't blank
//       ids.push(id); // Store the completely reconstructed ID
//       sys.puts(id);
//     }
//     id = ''; // Prepare for the next ID read
//     return;
//   }
//   console.log(id);
//   id += data; // Concat hex chars to the forming ID
// });

// open errors will be emitted as an error event
port.on('error', function(err) {
  console.log('Error: ', err.message);
})

