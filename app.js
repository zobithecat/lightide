var rpio = require('rpio');

var express = require("express");
var bodyParser = require("body-parser");
var http = require("http");
var path = require("path");
var BRIGHTNESS = 0;

function initGpioPwm(rpio){
  rpio.open(12, rpio.PWM);
  rpio.pwmSetClockDivider(64);
  rpio.pwmSetRange(12, 1024);
}

function testLed(rpio){
  console.log("!")
  for (var i = 0; i < 1024; i++){
    rpio.pwmSetData(12, i);
    rpio.msleep(1);
  }
  for (var i = 1023; i >= 0; i--){
      rpio.pwmSetData(12, i);
      rpio.msleep(1);
  }
}
function increaseBrightness(rpio, start, end){
  for (var i = start; i < end; i++){
    rpio.pwmSetData(12, i);
    rpio.usleep(100)
  }
}
function decreaseBrightness(rpio, start, end){
  for (var i = start; i >= end; i--){
    rpio.pwmSetData(12, i);
    rpio.usleep(100)
  }
}
function scalingValue(value){
  value = parseInt(Math.pow(value, 1.506))
  console.log(value);
  return value;
}
function setLedBrightness(rpio, value){
  value = scalingValue(value)
  if(BRIGHTNESS > value){
    decreaseBrightness(rpio, BRIGHTNESS, value);
  } else if(BRIGHTNESS < value) {
    increaseBrightness(rpio, BRIGHTNESS, value)
  }
  BRIGHTNESS = value;
}
var app = express();
var httpServer = http.createServer(app);
var io = require("socket.io")(httpServer);

app.use(bodyParser.json());
app.use("/public", express.static(path.join(__dirname, "public")));

initGpioPwm(rpio);

app.get('/', function(req,res){
  res.sendFile(__dirname + "/public/index.html");
  testLed(rpio);
});

io.sockets.on('connection', function(socket){
	console.log("connected!");
	socket.emit("connected", { msg: "connected!"});
	socket.on('forceDisconnect', function() {
		socket.disconnect();
	});

	socket.on('disconnect', function() {
		console.log('user disconnected: ' + socket.name);
	});
	socket.on('control', function(data){
    setLedBrightness(rpio, data.value)
		console.log(data);
	})
});

httpServer.listen(3000, function(){
	console.log("working on port 3000");
});


