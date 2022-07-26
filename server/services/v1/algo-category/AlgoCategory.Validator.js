const {body} = require('express-validator')

const validateCreateAlgoCategories = ()=>{
    return [
        body("name")
            .exists({checkFalsy:true, checkNull:true})
            .withMessage('Invalid value')
            .isString()
            .withMessage('Value must be String'),

        body("color")
            .exists({checkFalsy:true, checkNull:true})
            .withMessage('Invalid value')
            .isString()
            .withMessage('Value must be String')
            .contains("#")
            .withMessage("should contains # symbol")
            .isHexColor()
            .withMessage('Value must be hex-colour'),
        body('icon')
            .exists({checkFalsy:true, checkNull:true})
            .withMessage('Invalid value')
            .isString()
            .withMessage('Value must be String')
    ]
}



module.exports = {validateCreateAlgoCategories}
