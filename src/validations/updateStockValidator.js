const {body} = require('express-validator');
const db = require("../database/models");


module.exports = [
    body('cantidad')
    .notEmpty().withMessage('Ingresa una cantidad para poder sumarla al stock')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero')
    .custom((value, {req})=> {
        if(req.session.userLogin.destinoId != 31){
            return true; // No se dispara la validación custom porque el destino no es el cpfII
        }

        return db.Stock.findOne({ //busco un stock con el id del params y si es el 14 y si su cantidad es menor que la cantidad que manda el usuario rechazo la promesa
            where: {id:req.params.id}
        }).then(stock => {    

            if( (stock.idProducto == 14) && (stock.cantidad <= req.body.cantidad)){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('No hay productos suficientes para aumentar el stock de kits'))
    })

]