const {check} = require('express-validator');

module.exports = [

check('destino')
.notEmpty().withMessage('El destino es requerido')
 
]