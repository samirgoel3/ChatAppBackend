const server = require('./server/app')()
server.start();
global.SOCKETS = [];