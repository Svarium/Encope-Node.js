const {check, body} = require('express-validator');
const db = require("../database/models")

module.exports = [
    body('cantidad')
    .notEmpty().withMessage('La cantidad es requerida')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero')
    .custom((value,{req})=> {
        if (req.session.userLogin.destinoId != 31) {
            return true; // No se dispara la validación custom porque el destino es distinto que cpfII
        }

        if(req.body.producto != 13){
            return true
        }

      
        return db.Stock.findAll({
         })
         .then(stock => {
            const cantidades = stock.map(item => item.cantidad);
            const kitCantidad = req.body.cantidad;
            const isValid = cantidades.every(cantidad => kitCantidad <= cantidad);

            if(!isValid){
                return Promise.reject()
            }
         }).catch(error => Promise.reject('No hay productos suficientes para conformar la cantidad de kits'))
     })
    ,

    body('producto')
    .notEmpty().withMessage('Debes seleccionar un producto')
]

//CREO QUE TENGO QUE HACER DOS CUSTOM YA QUE QUIERO VALIDAR QUE:
// 1 - NO ME ENVIEN EL KIT COMPLETO SI EL RESTO DEL STOCK ES 0 EN EL DESTINO ID 31 
// 2 - QUE NO ME CARGUEN MAS KITS DE LOS QUE SE PUEDEN ARMAR TENIENDO EN CUENTA EL STOCK EXISTENTE
