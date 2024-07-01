const {check} = require('express-validator');

module.exports = [

    check('factura')
    .notEmpty().withMessage('Debes ingresar la factura del insumo adquirido').bail()
]