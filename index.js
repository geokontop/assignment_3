/*
 * Primary file for API
 *
 */

 // Dependencies
 const server = require('./src/server');
 const workers = require('./src/services/workers');

// Start servers
server.init();

// Start the workers
workers.init();


