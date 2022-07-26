const express = require('express')
const route = express.Router();
const controllerTester = require('../../services/v1/tester')

route.get('/create-test-token',controllerTester.createToken)

module.exports = route
