const {Server} = require("socket.io");
const Listener = require('../../services/v1/socket/Listeners')

var socketIO;

const initSocket = (server) => {
    socketIO = new Server(server, {
        pingTimeout:60000,
        cors:{
            origin:'http://localhost:5000',
            methods:['GET', 'PUT', 'POST', 'DELETE', 'OPTIONS'],
            allowedHeaders:["Origin', 'x-access-token', 'Content-Type', 'Accept"],
        }
      });

    socketIO.on('connection', (socket) => {

        Listener.onConnection(socket)

        socket.on("disconnect", (reason) => Listener.onDisconnection(socket, reason));

    });

}


module.exports = {
    initSocket: initSocket
};