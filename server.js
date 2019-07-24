const express = require('express');//Requiring the Express Server Module
const fs = require('fs');//Requiring the FileSystem Module
var WebSocketServer = require("ws").Server;//Requiring the Web Socket Module
const https = require('https');//Requiring the HTTPS Module
const path = require('path');
const http = require('http');
const mqtt = require('mqtt');

var app = express();
var name = app.use(express.static(__dirname));
console.log("Dir name is" + __dirname);
// app.use(express.static(__dirname + '/Hand JS')); 

//Body Parser setup with express to parse the JSON body sent by the frontend
//app.use(bodyParser.json());

//Setting up the CORS functionality in Express for Making AJAX calls
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

app.use((req,res,next)=>{
 var now = new Date().toString();
 var log =`${now}: ${req.method} ${req.url}`;
 fs.appendFile('server.log',log+'\n',(err)=>{
  if(err){
    console.log('Unable to append server.log.');
  }
 });
 next();
});

//GET Route when the website will be opened for the first time 
app.get('/help',(req,res)=>{
	
// res.sendFile(path.join(__dirname+'/index.html'));
// res.send('');
console.log('Got a request');
console.log("Dir name is" + __dirname);

});

const server = new http.createServer((request,response)=>{
  response.writeHead(200,{'Content-Type' : 'text/plain'})
  response.write("Hello HTTP Server Response");
  response.end();
});

//MQTT server connection initiaton
var client  = mqtt.connect('1883:localhost');//Port 1883 for MQTT Broker

//Socket Server Connection Initiation 
var ws = new WebSocketServer({server});
console.log("Socket server started");

//On Connection with MQTT Topic
client.on('connect', function () {
  client.subscribe('game');
  console.log('client has subscribed successfully to the MQTT topic');
});

//On Connection with Socket Server
ws.on("connection",function(ws) {
 ws.send("Welcome Hermit Broker");
  //Fetching messages from client side 
  ws.on("message",(data)=>{
  position = JSON.parse(data);
  console.log("Data from Browser ",position);
  client.publish("game",data);
 });

});

//Sending Message to Each of the subscribed clients on WebSockets
ws.clients.forEach(function(clients) {
  // if(topic == "panelchecking"){
clients.send(message.toString());
// console.log(message.toString + now);
// }
});
///////////////////////////////////////////////

//Port 3000 for Websocket
server.listen(3000,()=>{
console.log('Started on port 3000'); 
});

//Port 4000 for App
app.listen(4000,()=>{
console.log('Started on port 4000'); 
});