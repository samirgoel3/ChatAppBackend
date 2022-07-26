let localConfig = {
    app:{
        hostname: "localhost",
        app_secret:'Algo-Network',
        port:process.env.PORT || 3000,
        base_url: "http://13.235.152.2:3108",
        api_version:'v1'
    },
    db:{
        server_one :"mongodb+srv://MainClusture:94QikJPKmTndGaE3@mainclusture.l3f41ws.mongodb.net/?retryWrites=true&w=majority"
    }

};

module.exports = localConfig;
