const Endpoint = require('../../../utils/constants/Endpointers')
const {exceptionResponse, failureResponse, successResponse} = require("../../../utils/response-handlers");
const ModelAlgorithm = require("../../../models/model.algorithm");
const ModelAlgoCategory = require("../../../models/model.algocategory");
const ModelUser = require("../../../models/model.user");
var mongoose = require('mongoose');


create = async (req, res)=>{
    try{
        let checkCategory = await ModelAlgoCategory.find( {_id:""+req.body.category_id});
        if(!checkCategory)
            failureResponse(Endpoint.CREATE_ALGORITHM.endpoint, "Category Id not found", checkCategory, 200, req, res)

        let algorithm = await ModelAlgorithm.create(req.body);
        if(!algorithm){
            failureResponse(Endpoint.CREATE_ALGORITHM.endpoint,"Failed to create algorithm", [], 200, req, res)
        }
        else{
            successResponse(Endpoint.CREATE_ALGORITHM.endpoint, "Algorithm Successfully Created", algorithm, 200, req, res)
        }
    }catch (e){
        exceptionResponse(""+Endpoint.CREATE_ALGORITHM.name,"Exception Occurs", e.message,200 , req, res)
    }
}

getAlgorithmById = async (req, res)=>{
    try{
        let algorithm = await ModelAlgorithm.findOne( {_id:""+req.params.category_id}).select('-date -createdAt -updatedAt -__v');
        if(!algorithm)
            failureResponse(Endpoint.GET_ALGORITHM.endpoint, "Algorithm Not Found", algorithm, 200, req, res)

        if(!algorithm.active){
            failureResponse(""+Endpoint.GET_ALGORITHM.endpoint, "It seems that algorithm is not active ",[], 200, req, res)
        }else{
            successResponse(""+Endpoint.GET_ALGORITHM.endpoint, "Algorithm found", algorithm, 200, req, res)
        }


    }catch (e){
        exceptionResponse(""+Endpoint.GET_ALGORITHM.name,"Exception Occurs", e.message,200 , req, res)
    }
}

getAlgorithmsByCategoryId = async (req, res)=>{
    try{
        let algorithms = await ModelAlgorithm.find( {category_id:""+req.body.category_id, active:true}).select('-date -createdAt -updatedAt -__v');
        if(!algorithms || algorithms.length == 0){
            failureResponse(Endpoint.GET_ALGORITHM.endpoint, "Algorithms Not Found", [], 200, req, res)
        }else{
            successResponse(""+Endpoint.GET_ALGO_BY_CATEGORIES.endpoint, "Algorithm found", algorithms, 200, req, res)
        }

    }catch (e){
        exceptionResponse(""+Endpoint.GET_ALGO_BY_CATEGORIES.name,"Exception Occurs", e.message,200 , req, res)
    }
}

getAlgorithmByKey = async (req, res)=>{
    try{

        let categoryData = await ModelAlgoCategory.find({ "name" : { $regex: ""+req.body.key, $options: 'i' }, active:true }).select('-createdAt -updatedAt -__v -icon')

        let algorithmData = await ModelAlgorithm.aggregate([
            {$match:{"problem.heading":{$regex: ""+req.body.key, $options: 'i'},active:true}},
            {$project:{problem_statement:{$first: "$problem.heading"}, level:1, category_id:1}}
        ])
        if((!categoryData && !algorithmData) || (categoryData.length == 0  && algorithmData.length == 0 ) ){
            failureResponse(""+Endpoint.SEARCH_ALGORITHM.name,"No data found",[],200, req, res)
        }else{
           successResponse(""+Endpoint.SEARCH_ALGORITHM.name,"Search data found successfully", {categoryData, algorithmData}, 200, req, res)
        }





        // if(!algorithms || algorithms.length == 0){
        //     failureResponse(Endpoint.SEARCH_ALGORITHM.endpoint, "Algorithms Not Found", [], 200, req, res)
        // }else{
        //     successResponse(""+Endpoint.SEARCH_ALGORITHM.endpoint, "Algorithm found", algorithms, 200, req, res)
        // }

    }catch (e){
        exceptionResponse(""+Endpoint.SEARCH_ALGORITHM.name,"Exception Occurs", e.message,200 , req, res)
    }
}

addAlgoToFavourite = async (req, res)=>{
    try{
        const result = await ModelUser.findOne({_id:req.user_id, favourite_Algo:{$elemMatch:{value:req.body.algorithm_id}}})
        if(result){
            failureResponse(""+Endpoint.ADD_FAVOURITE.endpoint,"Algorithm already marked as favourite", {acknowledged:false}, 200, req, res)
        }
        else{
            const result = await ModelUser.updateOne({_id:req.user_id}, {$push:{favourite_Algo:{value:req.body.algorithm_id}}})
            if(result.acknowledged){
                successResponse(""+Endpoint.ADD_FAVOURITE.endpoint,"Algorithm added to favourite", {acknowledged:true}, 200, req, res)
            }else{
                failureResponse(""+Endpoint.ADD_FAVOURITE.endpoint,"Unable to mark as favourite", {acknowledged:false}, 200, req, res)
            }
        }

    }catch (e){
        return exceptionResponse(""+Endpoint.ADD_FAVOURITE.endpoint,"Exception Occurs", e.message,200, req, res)
    }
}

removeFromFavourite = async (req, res)=>{
    try{
        const result = await ModelUser.findOne({_id:req.user_id, favourite_Algo:{$elemMatch:{value:req.body.algorithm_id}}})
        if(!result){
            failureResponse(""+Endpoint.REMOVE_FAVOURITE.endpoint,"Algorithm not found as favourite", {acknowledged:false}, 200, req, res)
        }
        else{
            const result = await ModelUser.updateOne({_id:req.user_id}, {$pull:{favourite_Algo:{value:req.body.algorithm_id}}})
            if(result.acknowledged){
                successResponse(""+Endpoint.REMOVE_FAVOURITE.endpoint,"Algorithm removed from favourite", {acknowledged:true}, 200, req, res)
            }else{
                failureResponse(""+Endpoint.REMOVE_FAVOURITE.endpoint,"Unable to remove from favourite", {acknowledged:false}, 200, req, res)
            }
        }

    }catch (e){
        return exceptionResponse(""+Endpoint.ADD_FAVOURITE.endpoint,"Exception Occurs", e.message,200, req, res)
    }
}


module.exports = {create, getAlgorithmById, getAlgorithmsByCategoryId, getAlgorithmByKey, addAlgoToFavourite, removeFromFavourite}
