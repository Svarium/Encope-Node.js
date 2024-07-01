const {check} = require('express-validator');

module.exports = [

    check('detalle')
    .notEmpty().withMessage('Debes ingresar el detalle del insumo adquirido')
]