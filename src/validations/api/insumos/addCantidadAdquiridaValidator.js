const {check} = require('express-validator');
const db = require('../../../database/models');

module.exports = [

    check('cantidadAdquirida')
    .notEmpty().withMessage('La cantidad es requerida').bail()
    .matches(/^\d+(\.\d{1,2})?$/).withMessage('La cantidad debe ser un número con hasta dos decimales mayor que cero')
    .custom((value, {req}) => {
        return db.insumoProyecto.findOne({
            where : {
                proyectoId: req.body.idProyecto,
                insumoId: req.params.id
            }
        }).then(registroInsumoProyecto => {
            if( req.body.cantidadAdquirida < registroInsumoProyecto.cantidadRequerida){
                return Promise.reject()
            }
        }).catch((error) => {
            console.log(error);
            return Promise.reject("La cantidad adquirida no puede ser menor que la requerida")            
        })
    }),


]