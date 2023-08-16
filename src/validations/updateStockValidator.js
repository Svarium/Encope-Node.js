const {check, body} = require('express-validator');

module.exports = [
    body('cantidad')
    .notEmpty().withMessage('Ingresa una cantidad para poder sumarla al stock')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero'),
]