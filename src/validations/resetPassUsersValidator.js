const { body} = require('express-validator');



module.exports = [
    body('newPass')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida').bail()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres').bail()
]