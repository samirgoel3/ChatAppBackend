const express = require('express');
const router = express.Router();

const userController = require('../../controller/v1/Controller.Users');
const testerController = require('../../controller/v1/Controller.Tester');
router.use('/user', userController);
router.use('/test', testerController);


module.exports = router;

