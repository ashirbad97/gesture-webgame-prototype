const express = require('express');//Requiring the Express Server Module
const fs = require('fs');//Requiring the FileSystem Module
var WebSocketServer = require("ws").Server;//Requiring the Web Socket Module
const https = require('https');//Requiring the HTTPS Module
const path = require('path');
const http = require('http');
var robot = require('robotjs');

var app = express();
var name = app.use(express.static(__dirname));

//Setting up the CORS functionality in Express for Making AJAX calls
app.use(function(req, res, next) {

  res.header("Access-Control-Allow-Origin", "*");

  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");

  next();

});

const server = new http.createServer((request,response)=>{
  response.writeHead(200,{'Content-Type' : 'text/plain'})
  response.write("Hello HTTP Server Response");
  response.end();
});

//Socket Server Connection Initiation 
var ws = new WebSocketServer({server});

//On Connection with Socket Server
ws.on("connection",function(ws) {
 ws.send("Welcome Hermit Broker");
  //Fetching messages from client side 
  ws.on("message",(data)=>{
  position = JSON.parse(data);
  robot.moveMouse(position[0], position[1]);
  // console.log("Data from Browser ",position);
 });

});

//Port 3000 for Websocket
server.listen(3000,()=>{
console.log('Socket Server started on port 3000'); 
});

//Port 4000 for App
app.listen(4000,()=>{
console.log('Application Server started on port 4000'); 
});