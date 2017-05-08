var av = require('tessel-av');
var tessel = require('tessel');
//var os = require('os');
var http = require('http');
var port = 8000;
var camera = new av.Camera();
var ambientlib = require('ambient-attx4');
var ambient = ambientlib.use(tessel.port['A']);
var fs = require('fs');
var path = require('path');
// var express = require('express');
// var app = express();
var currentPicture;

// http.createServer((request, response) => {
//   console.log('got request!')
//   response.writeHead(200, { 'Content-Type': 'image/jpg' });
//   response.write(currentPicture);
//   // camera.capture().pipe(response);
//
// }).listen(port, () => console.log(`http://sam.local:${port}`));



// var currentPicture;
ambient.on('ready', function () {
  var currentLight;
 // Get points of light and sound data.
  setInterval( function () {
    ambient.getLightLevel( function(err, lightdata) {
      if (err) throw err;
        console.log("Light level:", lightdata.toFixed(8));
        currentLight = lightdata.toFixed(4);
        if (Number(currentLight) > .02){
          currentPicture = camera.capture();
          currentPicture.on('data', function(image){
          var request = http.request({
            hostname: '192.168.2.163', // Where your other process is running
            port: 1337,
            path: '/upload',
            method: 'POST',
            headers: {
              'Content-Type': 'image/jpg',
              'Content-Length': image.length
            }
          });

   request.write(image);
});
        }
    });
  }, 1000);  // The readings will happen every .5 seconds
});

ambient.on('error', function (err) {
  console.log(err);
});

// http.get('http://sam.local:8000/', function(req, res, next){
//   res.writeHead(200, { 'Content-Type': 'image/jpg' });
//   currentPicture.pipe(res);
// })

// app.get('/', function(req, res, next){
//   res.send("hello");
// })
