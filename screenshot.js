'use strict';
var spawn = require('child_process').spawn;
var debug = require('debug')('screenshot');

function screenshot(output, quality, cb){
  var proc, args, error;

  args = [
    '-window',
    'root',
    '-quality',
    quality || 75,
    output
  ];

  proc = spawn('import', args);

  proc.stderr.on('data', debug);
  proc.stdout.on('data', debug);

  proc.on('error', function(e){
    error = e
  });

  proc.on('close', function(code){
    if (cb){
      if (code === 0)
        cb(null, output);
      else
        cb(error || code)
    }
  });
}
module.exports = screenshot;
