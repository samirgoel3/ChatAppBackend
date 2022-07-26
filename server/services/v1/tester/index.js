const jwt = require('jsonwebtoken')
const createToken = async (req, res)=>{
    let token = await  jwt.sign({ user_id: 1}, "Algo-Network");
    res.send(token)
}

module.exports = {createToken}
