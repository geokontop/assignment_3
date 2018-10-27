/*
 * Primary server file 
 *
 */

// Dependencies
const http = require('http');
const https = require('https');
const config = require('./config');
const fs = require('fs');
const listener = require('./controllers/listener');
const router = require('./controllers/router');

// Container
const server = {};

 // Instantiate the HTTP server
const httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});


// Instantiate the HTTPS server
const httpsServerOptions = {
  'key': fs.readFileSync('./https/key.pem'),
  'cert': fs.readFileSync('./https/cert.pem')
};

const httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

server.init =function(){
    // Start the HTTP server
    httpServer.listen(config.httpPort,function(){
        console.log('The HTTP server is running on port '+config.httpPort);
      });
      
    // Start the HTTPS server
    httpsServer.listen(config.httpsPort,function(){
     console.log('The HTTPS server is running on port '+config.httpsPort);
    });
}

// All the server logic for both the http and https server
const unifiedServer = function(req,res){
  listener(router,req,res);
};

module.exports = server;