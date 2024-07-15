const {check} = require('express-validator');

module.exports = [

    check('decomiso')
    .notEmpty().withMessage('Debes ingresar la cantidad decomisada').bail()
    .isInt({min:1}).withMessage('La cantidad deber ser un número entero mayor que cero'),

    check('expediente')
    .notEmpty().withMessage('Debes ingresar el numero de expediente')
]