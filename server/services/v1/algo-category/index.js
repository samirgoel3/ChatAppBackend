const {validationResult} = require("express-validator");
const ResponseHandler = require("../../../utils/response-handlers");
const Endpoint = require("../../../utils/constants/Endpointers");
const ValidationErrorMessage = require("../../../utils/error-handler/ValidationErrorMessage");
const AlgoCategoryModel = require("../../../models/model.algocategory");
const {failureResponse, exceptionResponse, successResponse} = require("../../../utils/response-handlers");

const create = async (req, res)=>{

    try{
        const createdCategory = await AlgoCategoryModel.create(req.body)
        if(!createdCategory)
            failureResponse(""+Endpoint.CREATE_ALGO_CATEGORY.endpoint, "Failed to create category", [], 200, req ,res)

        successResponse(""+Endpoint.CREATE_ALGO_CATEGORY.endpoint,
            "Category created Successfully...",
            createdCategory,
            200, req ,res)
    }catch (e){
        exceptionResponse(""+Endpoint.CREATE_ALGO_CATEGORY.name,"Exception Occurs", e.message,200 , req, res)
    }

}


const getAllCategories = async (req, res)=>{

    try{
        const categories = await AlgoCategoryModel.find({active:true}).select('-__v  -updatedAt -createdAt')
        if(!categories || categories.length == 0 )
            failureResponse(""+Endpoint.GET_ALL_CATEGORIES.endpoint, "Failed to Fetch Category", [], 200, req ,res)

        successResponse(""+Endpoint.GET_ALL_CATEGORIES.endpoint,
            "Category fetched Successfully...",
            categories,
            200, req ,res)
    }catch (e){
        exceptionResponse(""+Endpoint.CREATE_ALGO_CATEGORY.name,"Exception Occurs", e.message,200 , req, res)
    }
}




module.exports = {create, getAllCategories}
