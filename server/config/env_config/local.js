let localConfig = {
    app:{
        hostname: "localhost",
        app_secret:'chat-app',
        port:process.env.PORT || 3005,
        base_url: "",
        api_version:'v1'
    },
    db:{
        
        server_one :""
    }

};

module.exports = localConfig;
