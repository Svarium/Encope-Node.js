const {check, body} = require('express-validator');


module.exports = [
    
    check('cantidad')
    .notEmpty().withMessage('debes ingresar una cantidad')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero'),

    check('egresos')
    .custom((value,{req})=> {
        if (value && parseInt(value) <= 0) {
            throw new Error('La cantidad debe ser un numero entero mayor que cero')
        }
        return true
    }),  

    check('observaciones')
    .custom((value,{req}) => {        
        if(value && (value.length < 5 || value.length > 255)){
            throw new Error('minimo de 5 y máximo de 255 caracteres')
        }
        return true

    })
]