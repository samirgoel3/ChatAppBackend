const express = require('express');
const router = express.Router();

const userController = require('../../controller/v1/Controller.Users');
const testerController = require('../../controller/v1/Controller.Tester');
const algoCategoryController = require('../../controller/v1/Controller.AlgoCategories')
const algorithmController = require('../../controller/v1/Controller.Algorithm')

router.use('/user', userController);
router.use('/test', testerController);
router.use('/algo-category', algoCategoryController);
router.use('/algorithm', algorithmController);


module.exports = router;

