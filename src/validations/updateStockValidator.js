const {body} = require('express-validator');
const db = require("../database/models");
const { Op } = require('sequelize');


module.exports = [
    body('cantidad')
    .notEmpty().withMessage('Ingresa una cantidad para poder sumarla al stock')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero')
    .custom(async (value, {req}) => {
        if (req.session.userLogin.destinoId != 31) {
            return true; // No se dispara la validación custom porque el destino no es el cpfII
        }
    
        const kit = await db.Stock.findOne({
            where: { id: req.params.id,
                     
            }
        });
    
        // Verificar si stock.idProducto es igual a 14
        if (kit.idProducto !== 13) {
            return true; // No se ejecuta la validación si no es igual a 14
        }
       
    
        try {
            const stocks = await db.Stock.findAll({
                where:{
                    idDestino:31, 
                    idProducto: { [db.Sequelize.Op.ne]: 13 }}
            });
            const frazada = await db.Stock.findOne({
                where:{ idProducto: 7}
            });

    
            const kitCantidad = +req.body.cantidad
            const cantidades = stocks.map(item => item.cantidad);
    
            const isValid = cantidades.every(cantidad => kitCantidad <= cantidad);
            const frazadasValid = (frazada.cantidad >= (2 * kitCantidad));          
    
            if (!isValid) {
                return Promise.reject('No hay productos suficientes para actualizar la cantidad de kits');
            } else if (!frazadasValid) {
                return Promise.reject('No hay frazadas suficientes para actualizar la cantidad de kits');
            } else {
                return true; // La validación es exitosa
            }
               
    
        } catch (error) {
            return Promise.reject('Ocurrió un error al procesar la solicitud');
        }
    })
]