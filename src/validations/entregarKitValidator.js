const {body} = require('express-validator');
const db = require("../database/models")

module.exports = [
    body('cantidad')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero')
    .custom((value, {req}) => {
        return db.Stock.findOne({
            where : {
                idProducto:13,
                idDestino:31,
                idUsuario:1
            }          
        }).then(stock => {
            if(stock.cantidad < value){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('La cantidad no puede ser mayor al stock existente'))
    })
    ,

    body('producto')
    .notEmpty().withMessage('Debes seleccionar un valor'),

    body('destino')
    .notEmpty().withMessage('Debes seleccionar un valor'),

    body('acta')
    .notEmpty().withMessage('El número de acta o de recibo de entrega es requerido')
]