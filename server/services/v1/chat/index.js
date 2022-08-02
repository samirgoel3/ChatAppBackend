const ResponseHandler = require('../../../utils/response-handlers')
const Endpoint = require('../../../utils/constants/Endpointers')
const ModelChat = require('../../../models/model.chat')
const ModelMessages = require('../../../models/model.message')
const { forEach } = require('lodash')
const e = require('cors')
const { populate } = require('../../../models/model.chat')


createOneToOneChat = async (req, res) => {
    try {
        const {chatname, users,groupadmin } = req.body

        const result = await ModelChat.updateOne(
            {groupadmin}, // find group admin exist or not
            {chatname, users,groupadmin },
            { upsert: true, new:true }, // Make this update into an upsert
          );
          if(result.modifiedCount == 0 ){
            ResponseHandler.successResponse("" + Endpoint.CREATE_ONE_ONE_CHAT.name,"Chat room was created successfully",{chat_id:result.upsertedId}, 200, req, res);
          }else{
            let CHATID = await ModelChat.find({groupadmin:groupadmin}).select('_id')
            ResponseHandler.successResponse("" + Endpoint.CREATE_ONE_ONE_CHAT.name,"Chat room was already exist so updated successfully",{chat_id:CHATID[0]._id}, 200, req, res);
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
        .select('content -_id sender createdAt chat')
        .populate('chat', 'chatname isgroupchat') 
        .populate('sender', 'username')

        // separating out element according to required JSON
        var GroupChats = [], OneToOneChats=[];
        unreadMessages.forEach((el)=>{
            if(el.chat.isgroupchat){
                let indexOfChat = GroupChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                console.log("index on insider "+indexOfChat)
                if(indexOfChat != -1){
                    GroupChats[indexOfChat].messages.push({content:el.content, sender:el.sender})
                    }
                else{ GroupChats.push({chat_id:el.chat._id, chatname:el.chat.chatname, messages:[{content:el.content, sender:el.sender}]}) } 
                }
            else{
                let indexOfChat = OneToOneChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                if(indexOfChat != -1){
                    OneToOneChats[indexOfChat].messages.push({content:el.content, sender:el.sender})
                }
                else{
                    OneToOneChats.push({chat_id:el.chat._id, chatname:el.chat.chatname, messages:[{content:el.content, sender:el.sender}]})
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
        .select('content -_id sender createdAt chat')
        .populate([{
            path:'chat',
            populate:{
                path:'users',
                select:'username image'
            }
        }]) 
        .populate('sender', 'username')

        // separating out element according to required JSON
        var GroupChats = [], OneToOneChats=[];
        unreadMessages.forEach((el)=>{
            if(el.chat.isgroupchat){
                let indexOfChat = GroupChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                console.log("index on insider "+indexOfChat)
                if(indexOfChat != -1){
                    GroupChats[indexOfChat].last_message = {content:el.content, sender:el.sender, createdAt:el.createdAt}
                    }
                else{ GroupChats.push({chat_id:el.chat._id, chatname:el.chat.chatname, last_message:{content:el.content, sender:el.sender, createdAt:el.createdAt}}) } 
                }
            else{
                let indexOfChat = OneToOneChats.findIndex((e)=>{ return  e.chat_id == el.chat._id })
                if(indexOfChat != -1){
                    OneToOneChats[indexOfChat].last_message = {content:el.content, sender:el.sender, createdAt:el.createdAt}
                }
                else{

                    let secondUserIndex =   el.chat.users[0]._id == user_id ? 1 : 0;  
                    OneToOneChats.push({chat_id:el.chat._id, chatname:el.chat.users[secondUserIndex].username, chaticon:el.chat.users[secondUserIndex].image, last_message:{content:el.content, sender:el.sender, createdAt:el.createdAt}})
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