const express = require('express');
const router = express.Router();
const MessageService = require('../../services/v1/messages')
const AuthGuard = require('../../middlewares/authGaurd')
const Constants = require('../../utils/constants')
const { throwValidationErrorResponse } = require('../../utils/response-handlers')
const { authenticateClientToken } = require('../../middlewares/authGaurd')


router.post(Constants.EndPoints.SEND_MESSAGE.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    MessageService.create);

router.post(Constants.EndPoints.MARK_MESSAGE_AS_READ.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    MessageService.markMessageAsRead);

router.get(Constants.EndPoints.GET_ALL_MESSAGE_OF_CHAT.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    MessageService.getAllMessageByChatId);

router.get(Constants.EndPoints.GET_ALL_UNREAD_MESSAGE_OF_CHAT.endpoint,
    // UserValidator.validateCreateUser(),
    // throwValidationErrorResponse ,
    MessageService.getAllUnreadMessageByChatIdAndUserId);


module.exports = router;


