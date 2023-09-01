const {body} = require('express-validator');
const db = require("../database/models");


module.exports = [
    body('cantidad')
    .notEmpty().withMessage('Ingresa una cantidad para poder sumarla al stock')
    .isInt({min:1}).withMessage('La cantidad debe ser un numero entero mayor que cero')
    .custom(async (value, {req}) => {
        if (req.session.userLogin.destinoId != 31) {
            return true; // No se dispara la validación custom porque el destino no es el cpfII
        }
    
        const kit = await db.Stock.findOne({
            where: { id: req.params.id }
        });
    
        // Verificar si stock.idProducto es igual a 14
        if (kit.idProducto !== 14) {
            return true; // No se ejecuta la validación si no es igual a 14
        }
    
        try {
            const stocks = await db.Stock.findAll();
    
            const kitCantidad = kit.cantidad;
            const cantidades = stocks.map(item => item.cantidad);
    
            const isValid = cantidades.every(cantidad => kitCantidad <= cantidad);
    
            if (!isValid) {
                return Promise.reject('No hay productos suficientes para actualizar la cantidad de kits');
            }
    
            return true; // La validación es exitosa
    
        } catch (error) {
            return Promise.reject('Ocurrió un error al procesar la solicitud');
        }
    })

]