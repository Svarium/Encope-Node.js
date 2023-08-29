const {check} = require('express-validator');

module.exports = [

check('producto')
    .notEmpty().withMessage('El producto es requerido'),

check('destino')
.notEmpty().withMessage('El destino es requerido')
 
]