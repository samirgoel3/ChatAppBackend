const jwt = require('jsonwebtoken')
const Config = require('../config/env_config/config')

const authenticateClientToken = async (req, res, next)=>{
    let token = req.headers['x-access-token'];
    if (!token) {
        return res.status(200).json({
            result: 0,
            "errors": [{
                "msg": "No token provided"
            }]
        });
    }

    jwt.verify(token, Config.app.app_secret, (err, decoded) => {
        if (err) {
            return res.status(200).json({
                result: 0,
                "errors": [{
                    "msg": "Invalid Token"
                }]
            });
        }

        req.user_id = decoded.user_id;
        return next();
    });
}

module.exports = {authenticateClientToken}
