const ResponseHandler = require('../../../utils/response-handlers')
const Endpoint = require('../../../utils/constants/Endpointers')
const UserModel = require('../../../models/model.user')
const {failureResponse, exceptionResponse, successResponse} = require("../../../utils/response-handlers");
const JWT  = require('jsonwebtoken')
const Config  = require('../../../config/env_config/config')
const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');

create = async (req, res)=>{
    try{
        const isAlreadyExist = await UserModel.isEmailExistInDb(req.body.email)

        if(isAlreadyExist) return failureResponse(
            ""+Endpoint.CREATE_USER.url,
            "It seems this user email is already used",
            [],200,req, res)


        let createdUser = await UserModel.create({
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            image: ""+faker.image.abstract(),
            developer:req.body.developer
        });


        let token = await JWT.sign({user_id: createdUser._id}, Config.app.app_secret);

        createdUser['token'] = token;

        let ObjectToReturn = {
            username: createdUser.username,
            email: createdUser.email,
            image: createdUser.image,
            developer:createdUser.developer,
            token:createdUser.token
        }

        ResponseHandler.successResponse(""+Endpoint.CREATE_USER.endpoint,
            "User created Successfully...",
            ObjectToReturn,
            200, req ,res)
    }catch (e){
        exceptionResponse(""+Endpoint.CREATE_USER.name,"Exception Occurs", e.message,200 , req, res)
    }
}

login = async (req, res)=>{
    try{
        let loggedInUser = await UserModel.findOne({email:req.body.email, password:req.body.password}).select('-__v -password -date -favourite_Algo -createdAt -updatedAt')
        // user not exist in DB
        if(!loggedInUser)
            return failureResponse(""+Endpoint.LOGIN_USER.name,"User does not exist ",[], 200, req, res)


        let token = await JWT.sign({user_id:loggedInUser._id}, Config.app.app_secret);
        loggedInUser['token'] = token;

        return successResponse(""+Endpoint.LOGIN_USER.name, "User Logged in successfully",loggedInUser, 200, req, res)

    }catch (e){
      return exceptionResponse(""+Endpoint.LOGIN_USER.endpoint,"Exception Occurs", e.message,200, req, res)
    }
}

verifyEmail = async (req, res)=>{
    try{
        let isEmailExist = await UserModel.findOne({email:req.body.email})
        // user not exist in DB
        if(!isEmailExist)
            return failureResponse(""+Endpoint.CHECK_EMAIL_EXIST.name,"Email does not exist in our system ",[], 200, req, res)

        let keyForPassword = await JWT.sign({email:req.body.email}, Config.app.app_secret,{expiresIn: '3m'})

        return successResponse(""+Endpoint.CHECK_EMAIL_EXIST.name, "Email found successfully", {reset_key:keyForPassword}, 200, req, res)

    }catch (e){
      return exceptionResponse(""+Endpoint.CHECK_EMAIL_EXIST.name,"Exception Occurs", e.message,200, req, res)
    }
}

resetPassword = async (req, res)=>{
    try{

        let decompiledToken = await  JWT.verify(req.body.reset_key, Config.app.app_secret)
        let updateResult = await UserModel.findOneAndUpdate({email:decompiledToken.email}, {password:req.body.password})

        successResponse(""+Endpoint.RESET_PASSWORD.endpoint,"Password updated successfully", [], 200, req, res);

    }catch (e){
        return exceptionResponse(""+Endpoint.RESET_PASSWORD.endpoint,"Exception Occurs", e.message,200, req, res)
    }
}







module.exports = {create, login, verifyEmail, resetPassword}
