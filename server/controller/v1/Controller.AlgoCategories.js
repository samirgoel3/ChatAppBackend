const express = require('express');
const router = express.Router();
const AlgoCategoryService  = require('../../services/v1/algo-category')
const AlgoCategoryValidator = require('../../services/v1/algo-category/AlgoCategory.Validator')
const AuthGuard = require('../../middlewares/authGaurd')
const Constants = require('../../utils/constants')
const {throwValidationErrorResponse} = require('../../utils/response-handlers')


router.post(Constants.EndPoints.CREATE_ALGO_CATEGORY.endpoint,
    AuthGuard.authenticateClientToken,
    AlgoCategoryValidator.validateCreateAlgoCategories(),
    throwValidationErrorResponse,
    AlgoCategoryService.create);


router.get(Constants.EndPoints.GET_ALL_CATEGORIES.endpoint, AuthGuard.authenticateClientToken,AlgoCategoryService.getAllCategories)


module.exports = router;


