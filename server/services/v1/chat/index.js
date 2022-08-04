const ResponseHandler = require('../../../utils/response-handlers')
const Endpoint = require('../../../utils/constants/Endpointers')
const ModelChat = require('../../../models/model.chat')
const ModelMessages = require('../../../models/model.message')
const { forEach } = require('lodash')
const e = require('cors')
const { populate } = require('../../../models/model.chat')
const {faker} = require('@faker-js/faker')


createOneToOneChat = async (req, res) => {
    try {
        const {chatname, users,groupadmin } = req.body


        const chatWithReqGroupAdmins = await ModelChat.find({groupadmin:{$all:groupadmin}})
        if(chatWithReqGroupAdmins.length == 0 ){
            const result = await ModelChat.create({chatname, users,groupadmin })
            if(result){
                ResponseHandler.successResponse("" + Endpoint.CREATE_ONE_ONE_CHAT.name,"One to one chat crtearted successfully",{chat_id:result._id}, 200, req, res);
            }
            else{
                ResponseHandler.failureResponse("" + Endpoint.CREATE_ONE_ONE_CHAT.name,"Failed top create one to one chat",result, 200, req, res);
            }
        }
        else{
            ResponseHandler.successResponse("" + Endpoint.CREATE_ONE_ONE_CHAT.name,"It seems like one to one chat was already create with these users",{chat_id:chatWithReqGroupAdmins[0]._id}, 200, req, res);
        }
        
        
    } catch (e) {
        ResponseHandler.exceptionResponse("" + Endpoint.CREATE_ONE_ONE_CHAT.name, "Exception Occurs ---->>>", e.message, 200, req, res)
    }
}

createChatGroup = async (req, res)=>{
    try{
        const {chatname, users,groupadmin } = req.body
        const result = await ModelChat.create({chatname, users,groupadmin, isgroupchat:true});
        ResponseHandler.successResponse(""+ Endpoint.CREATE_GROUP_CHAT.name, "Chat Group is Created Successfully",result,200, req, res);
    }catch(e){
        ResponseHandler.exceptionResponse("" + Endpoint.CREATE_GROUP_CHAT.name, "Exception Occurs ---->>>", e.message, 200, req, res)
    }
}

getChatGroups = async (req, res)=>{
    try{
        const result = await ModelChat.find({users:req.user_id, isgroupchat:true}).select('chatname -_id groupadmin');
        if(result.length > 0){
            ResponseHandler.successResponse(""+ Endpoint.CREATE_GROUP_CHAT.name, "Chat Group is Fetched Successfully",result,200, req, res);
        }
        else{
            ResponseHandler.failureResponse(""+ Endpoint.CREATE_GROUP_CHAT.name, "No Chat groups found",result,200, req, res);
        }
        
    }catch(e){
        ResponseHandler.exceptionResponse("" + Endpoint.CREATE_GROUP_CHAT.name, "Exception Occurs ---->>>", e.message, 200, req, res)
    }
}

editChatGroup = async (req, res)=>{
    try{
        const {chatname, users,groupadmin } = req.body
        let result = await ModelChat.findOneAndUpdate({_id:req.body.id}, {chatname, users, groupadmin})
        if(result){
            ResponseHandler.successResponse(""+ Endpoint.EDIT_GROUP_CHAT.name, "Chat Group is Updated Successfully",[],200, req, res);
        }
        else{
            ResponseHandler.successResponse(""+ Endpoint.EDIT_GROUP_CHAT.name, "Unable to update chat group",[],200, req, res);

        }
    }catch(e){
        ResponseHandler.exceptionResponse("" + Endpoint.EDIT_GROUP_CHAT.name, "Exception Occurs ---->>>", e.message, 200, req, res)
    }

}

getAllChatsWithUnreadMessages = async(req, res)=>{
    try{
        let{user_id} = req.query
        
        let chats = await ModelChat.find({ users: user_id}).select('_id') // finding chat room of a user
        
        // from above chats filtering out message that is not ready by user
        let unreadMessages = await ModelMessages.find({chat:{$in:chats}, readby:{$nin:user_id}})
        .select('content sender createdAt chat readby')
        .populate([{
            path:'chat',
            populate:{
                path:'users',
                select:'username image'
            }
        }])  
        .populate('sender', 'username image')
        .populate('readby','username image')

        // separating out element according to required JSON
        var GroupChats = [], OneToOneChats=[];
        unreadMessages.forEach((el)=>{
            if(el.chat.isgroupchat){
                let indexOfChat = GroupChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                console.log("index on insider "+indexOfChat)
                if(indexOfChat != -1){
                    GroupChats[indexOfChat].last_message = {content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}
                    }
                else{ GroupChats.push({chat_id:el.chat._id, chatname:el.chat.chatname,chaticon:faker.image.business(), last_message:{content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}}) } 
                }
            else{
                let indexOfChat = OneToOneChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                if(indexOfChat != -1){
                    OneToOneChats[indexOfChat].last_message = {content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}
                }
                else{
                    let secondUserIndex =   el.chat.users[0]._id == user_id ? 1 : 0;  
                    OneToOneChats.push({chat_id:el.chat._id, chatname:el.chat.users[secondUserIndex].username, chaticon:el.chat.users[secondUserIndex].image, last_message:{content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}})
                }
            }
        })


        let dataToSend = {
            group_chat:GroupChats,
            one_to_one_chat:OneToOneChats
        }
        if(GroupChats.length == 0 && OneToOneChats.length == 0 ){
            ResponseHandler.successResponse(""+ Endpoint.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.name, "No Unread Messages Found",[],200, req, res);
        }else{
            ResponseHandler.successResponse(""+ Endpoint.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.name, "Messages found as unread ",dataToSend,200, req, res);
        }
    }catch(e){
        ResponseHandler.exceptionResponse("" + Endpoint.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.name, "Exception Occurs ---->>>", e.message, 200, req, res)
    }
}


getAllChatsWithReadMessages = async(req, res)=>{
    try{
        let{user_id} = req.query
        
        // finding chat room of a user in which he exist
        let chats = await ModelChat.find({ users: user_id}).select('_id')
       
        
        // from above chats filtering out message that is not ready by user
        let unreadMessages = await ModelMessages.find({chat:{$in:chats}, readby:{$in:user_id}})
        .select('content sender createdAt chat readby')
        .populate([{
            path:'chat',
            populate:{
                path:'users',
                select:'username image'
            }
        }]) 
        .populate('sender', 'username image')
        .populate('readby','username image')

        // separating out element according to required JSON
        var GroupChats = [], OneToOneChats=[];
        unreadMessages.forEach((el)=>{
            if(el.chat.isgroupchat){
                let indexOfChat = GroupChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                console.log("index on insider "+indexOfChat)
                if(indexOfChat != -1){
                    GroupChats[indexOfChat].last_message = {content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}
                    }
                else{ GroupChats.push({chat_id:el.chat._id, chatname:el.chat.chatname,chaticon:faker.image.business(), last_message:{content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}}) } 
                }
            else{
                let indexOfChat = OneToOneChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                if(indexOfChat != -1){
                    OneToOneChats[indexOfChat].last_message = {content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}
                }
                else{
                    let secondUserIndex =   el.chat.users[0]._id == user_id ? 1 : 0;  
                    OneToOneChats.push({chat_id:el.chat._id, chatname:el.chat.users[secondUserIndex].username, chaticon:el.chat.users[secondUserIndex].image, last_message:{content:el.content, sender:el.sender, createdAt:el.createdAt, _id:el._id, readby:el.readby}})
                }
            }
        })


        let dataToSend = {
            group_chat:GroupChats,
            one_to_one_chat:OneToOneChats
        }
        if(GroupChats.length == 0 && OneToOneChats.length == 0 ){
            ResponseHandler.failureResponse(""+ Endpoint.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.name, "No Chats Found",{},200, req, res);
        }else{
            ResponseHandler.successResponse(""+ Endpoint.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.name, "Recent messages found ",dataToSend,200, req, res);
        }
    }catch(e){
        ResponseHandler.exceptionResponse("" + Endpoint.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.name, "Exception Occurs ---->>>", e.message, 200, req, res)
    }
}



module.exports = { createOneToOneChat, createChatGroup, getChatGroups, editChatGroup, getAllChatsWithUnreadMessages, getAllChatsWithReadMessages }


// if (req.body.id) {
//     // adding element in array
//     // let addAdmin = await ModelChat.updateOne({_id:req.body.id}, {$push:{ groupadmin:req.body.id}})
//     // ResponseHandler.successResponse("" + Endpoint.CREATE_UPDATE_CHAT.endpoint,
//     //     "This is create update api ",
//     //     addAdmin,
//     //     200, req, res)



//     // remove element in array
//     // let addAdmin = await ModelChat.updateOne({_id:req.body.id}, {$pull:{ groupadmin:req.body.id}})
//     // ResponseHandler.successResponse("" + Endpoint.CREATE_UPDATE_CHAT.endpoint,
//     //     "This is create update api ",
//     //     addAdmin,
//     //     200, req, res)


//    // find all doc in which array contains an object_id/value
// //    let data = await ModelChat.find({users:["62e0ad03c59659ba6a2f0cd7", "62e0e214c2ab821b34de7ea0"]}).select('chatname')
// //    ResponseHandler.successResponse("" + Endpoint.CREATE_UPDATE_CHAT.endpoint,
// //        "This is create update api ",
// //        data,
// //        200, req, res) 


// // find all doc in which array contains an object_id/value level 2
//    let data = await ModelChat.find({groupadmin:"62e0ad03c59659ba6a2f0cd7", users:"62e0ad03c59659ba6a2f0cd7"}).populate('groupadmin', 'username , email -_id').select('chatname')
//    ResponseHandler.successResponse("" + Endpoint.CREATE_UPDATE_CHAT.endpoint,
//        "This is create update api ",
//        data,
//        200, req, res)





//     // // find all doc in which array does not contain a object_id/value   
//     // let data = await ModelChat.find({users:{ $nin:'62e0ad03c59659ba6a2f0cd7'}}).select('chatname')
//     // ResponseHandler.successResponse("" + Endpoint.CREATE_UPDATE_CHAT.endpoint,
//     //     "This is create update api ",
//     //     data,
//     //     200, req, res)
        
// }
// // update chat - add group admin



// else {
//     let createdUser = await ModelChat.create({
//         chatname: req.body.chatname,
//         isgroupchat: req.body.isgroupchat,
//         users: req.body.users,
//         groupadmin: req.body.groupadmin
//     });


//     ResponseHandler.successResponse("" + Endpoint.CREATE_UPDATE_CHAT.endpoint,
//         "This is create update api ",
//         createdUser,
//         200, req, res)}