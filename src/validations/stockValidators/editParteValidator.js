const {check, body} = require('express-validator');
const db = require("../../database/models");


module.exports = [
    
    check('cantidad')
    .isInt({min: 1}).withMessage('La cantidad debe ser un numero entero mayor que cero')
    .custom(async (value, {req}) => {
        try {
            const parte = await db.Parte.findOne({where: {id: req.params.id}});          
            
            if (parte.cantidadAProducir <= parte.cantidadProducida) {
                return Promise.reject('Se alcanzó la cantidad a producir');
            } else if (parte.cantidadAProducir < req.body.cantidad) {
                return Promise.reject('La cantidad supera la cantidad a producir');
            } else {
                return true;
            }
        } catch (error) {
            console.log(error);
            return Promise.reject('Error al buscar el parte');
        }
    }),

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