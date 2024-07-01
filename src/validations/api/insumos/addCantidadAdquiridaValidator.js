const {check} = require('express-validator');

module.exports = [

    check('cantidadAdquirida')
    .notEmpty().withMessage('Debes ingresar la cantidad adquirida del insumo').bail()
    .isInt({min:1}).withMessage('La cantidad deber ser un número entero mayor que cero')
]