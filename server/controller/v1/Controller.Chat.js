const express = require('express');
const router = express.Router();
const UserService = require('../../services/v1/users')
const UserValidator = require('../../services/v1/users/User.Validator')
const AuthGuard = require('../../middlewares/authGaurd')
const Constants = require('../../utils/constants')
const { throwValidationErrorResponse } = require('../../utils/response-handlers')
const { authenticateClientToken } = require('../../middlewares/authGaurd')
const ChatService = require('../../services/v1/chat')


router.post(Constants.EndPoints.CREATE_ONE_ONE_CHAT.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    ChatService.createOneToOneChat);

router.post(Constants.EndPoints.CREATE_GROUP_CHAT.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    ChatService.createChatGroup);

router.post(Constants.EndPoints.GET_GROUP_CHAT_BY_USER_ID.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    ChatService.getChatGroups);


router.post(Constants.EndPoints.EDIT_GROUP_CHAT.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    ChatService.editChatGroup);


router.get(Constants.EndPoints.GET_ALL_CHATS_WITH_UNREAD_MESSAGE.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    ChatService.getAllChatsWithUnreadMessages);




module.exports = router;


