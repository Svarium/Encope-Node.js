const {check, body} = require('express-validator');

module.exports = [
    body('cantidad')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero'),

    body('producto')
    .notEmpty().withMessage('Debes seleccionar un valor')
]