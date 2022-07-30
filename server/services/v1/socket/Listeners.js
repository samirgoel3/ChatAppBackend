const onConnection = async (socket)=>{
    console.log('a user connected from Listener '+socket.id);
}


const onDisconnection = async (socket, reason)=>{
    console.log("A user with socket id:"+ socket.id +" is disconnected due to "+reason)
}


module.exports = {onConnection, onDisconnection}