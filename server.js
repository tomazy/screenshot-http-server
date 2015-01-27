'use strict';
var express    = require('express');
var esm        = require('event-source-manager');
var debug      = require('debug')('screenshot-server')
var screenshot = require('./screenshot');

var SCREENSHOT_FILE_NAME = 's.jpg'
var SCREENSHOT_PATH      = '/' + SCREENSHOT_FILE_NAME;
var DEFAULT_PORT         = 8989;
var DEFAULT_QUALITY      = 50;
var DEFAULT_FREQ         = 1000; //ms
var EVENT_TYPE           = 'screenshot'

var screenshotQuality = DEFAULT_QUALITY;
var screenshotFreq    = DEFAULT_FREQ;

var app = express();

function screenshotLoop(){
  var lastScreenshotTimestamp = 0, ready = true;

  function nextScreenshot(){
    if (!ready)
      return;
    ready = false;
    screenshot('/tmp/' + SCREENSHOT_FILE_NAME, screenshotQuality, function(err){
      lastScreenshotTimestamp = new Date;
      esm.broadcast(EVENT_TYPE, SCREENSHOT_FILE_NAME + '?' + lastScreenshotTimestamp.getTime());
      ready = true;
    });
  }

  function check(){
    if (esm.connectionsCount()){
      if (new Date - lastScreenshotTimestamp > screenshotFreq){
        nextScreenshot();
      }
    }
    setTimeout(check, 50);
  }
  check();
}
screenshotLoop();

app.get('/', function(req, res){
  var options = {
    root: __dirname + '/public/'
  };
  res.sendFile('index.html', options);

  screenshotQuality = req.query.q ? parseInt(req.query.q, 10) : DEFAULT_QUALITY;
  debug('setting screenshot quality', screenshotQuality);

  screenshotFreq =  req.query.t ? parseInt(req.query.t, 10) : DEFAULT_FREQ;
  debug('setting screenshot frequency', screenshotFreq);
});

app.get('/events', esm);

app.get(SCREENSHOT_PATH, function(req, res){
  var options = {
    root: '/tmp/',
    headers: {
      'Cache-Control': 'no-cache'
    }
  };
  res.sendFile(SCREENSHOT_FILE_NAME, options);
});

var server = app.listen(process.env.PORT || DEFAULT_PORT, function(err){
  var host = server.address().address;
  var port = server.address().port;

  console.log('screenshot server listening at http://%s:%s', host, port);
});
