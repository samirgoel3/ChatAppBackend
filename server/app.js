const express = require('express');
const http = require('http');
const fileUpload = require('express-fileupload')
const route = require('./routes')
const socketRoute = require('./routes/socket')
const config = require('./config/env_config/config')
const bodyParser = require('body-parser')
const mongoose = require('mongoose');
const cors = require('cors');
const { ServerApiVersion } = require('mongodb');


module.exports = function () {
    let ApiServerApp = express(), mainServer, create, start;

    create = () => {
        ApiServerApp.set('hostname', config.app.hostname);
        ApiServerApp.set('port', config.app.port);

        // For Retreving files in request
        ApiServerApp.use(fileUpload())


        // CORS
        ApiServerApp.options('*', cors());
        ApiServerApp.use(function (req, res, next) {
            res.header("Access-Control-Allow-Origin", "*");
            res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE, OPTIONS');
            res.header("Access-Control-Allow-Headers", "Origin, x-access-token, Content-Type, Accept");
            next();
        });

        // Middleware
        ApiServerApp.use(bodyParser.json({ limit: '50mb', extended: true }));
        ApiServerApp.use(bodyParser.urlencoded({ extended: false }));


        mongoose.connect(config.db.server_one, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverApi: ServerApiVersion.v1,
            dbName: 'App-Database',
            autoIndex: true,
        })
            .then((res) => {  console.log('#####---> Mongo DB Connected!'); })
            .catch(err => { console.log("####----> Mongo Db not Connected" + err); });

        route.initApi(ApiServerApp)
        mainServer = http.createServer(ApiServerApp)
        socketRoute.initSocket(mainServer)


    };


    start = () => {
        create();
        let hostname = ApiServerApp.get("hostname"),
            port = ApiServerApp.get("port");


        mainServer.listen(port, () => {
            console.log("#####---> Express Server is listening on - https://" + hostname + ":" + port);
        });
    };

    return {
        create, start
    };
};
