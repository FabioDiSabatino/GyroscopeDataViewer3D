var express = require('express');
var app = express();
var path = require('path');

var SerialPort = require('serialport');

var connectioWS;

var expressWs = require('express-ws')(app);



/************************************** viewed at http://localhost:3000 ****************/
app.get('/', function(req, res) {
    res.setHeader("Content-Type", ''); //Solution!
    app.use(express.static(__dirname ));
    res.sendFile(path.join(__dirname + '/index.html'));
    console.log(__dirname + 'index.html');
});

app.ws('/', function(ws, req) {
    connectioWS=ws;
    ws.on('message', function(msg) {
        console.log(msg);
        ws.send("hello!!");
    });

});

app.listen(3000,function(){
    console.log("server runnig at port 3000");
});

/****************************************   END ****************************** **/

try{
    var port = new SerialPort('COM3',{
        baudRate: 115200,
    });
}catch (e) {
    console.log(e.toString())
}




port.on('open',onOpen);
port.on('data',onData);

function onOpen(){
    console.log("connection open");

}

function onData(data){
    console.log('data received..');
    if (connectioWS!=null){
        connectioWS.send(data.toString())
    }else{
        console.log("no ws connection...")
    }

}