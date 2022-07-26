const Config = require('../../config/env_config/config')
module.exports = {
    CREATE_USER:{
        name: "Create user",
        endpoint:"/create",
        posting_script: false,
        response: false,
        request_type:"POST",
        platform_type:"Mobile App",
        url:Config.app.base_url+"api/"+Config.app.api_version+"/user/create",
        description: "This api is used only creating user only as a normal user"
    },
    LOGIN_USER:{
        name: "Login user",
        endpoint:"/login",
        posting_script: false,
        response: false,
        request_type:"POST",
        platform_type:"Mobile App",
        url:Config.app.base_url+"api/"+Config.app.api_version+"/user/login",
        description: "This api is used only for login user"
    },
    CHECK_EMAIL_EXIST:{
        name: "Email Exist",
        endpoint:"/check-email",
        posting_script: false,
        response: false,
        request_type:"POST",
        platform_type:"Mobile App",
        url:Config.app.base_url+"api/"+Config.app.api_version+"/user/check-email",
        description: "This api is user for email exist in DB or not"
    },
    RESET_PASSWORD:{
        name: "Reset Password",
        endpoint:"/reset-password",
        posting_script: false,
        response: false,
        request_type:"POST",
        platform_type:"Mobile App",
        url:Config.app.base_url+"api/"+Config.app.api_version+"/user/reset-password",
        description: "This api is user for email exist in DB or not"
    }
}
