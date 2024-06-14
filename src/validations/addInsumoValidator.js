const {check} = require('express-validator');


module.exports = [

    check('nombre')
    .notEmpty().withMessage('Debe ingresar el nombre del insumo').bail()
    .isLength({min:5, max:200}).withMessage('El nombre debe tener entre 5 y 200 carácteres').bail()
    .isAlpha('es-ES',{
        ignore:" "
    }).withMessage("Solo carácteres alfabéticos"),

    check('unidad')
    .notEmpty().withMessage('Debes ingresar la unidad de medida'),

    check('cantidad')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero'),

    

]