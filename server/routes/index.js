const apiRoutes = require('./apis');
const {Server} = require("socket.io");


const initApi = (server) => {

    server.use('*', (req, res, next) => {
        console.log('Request was made to : ' + req.method + " -> " + req.originalUrl + '\n*******************');
        next();
    });

    server.get('/', (req, res) => {
        res.send('Algo Network site is working')
    })

    server.use('/api', apiRoutes);

};


const initSocket = (server) => {
    const io = new Server(server, {
        // options
      });

    console.log('#####---> Making Connection for Socket')
    io.on('connection', (socket) => {
        console.log('a user connected');
    });
}





module.exports = {
    initApi: initApi,
    initSocket: initSocket
};
