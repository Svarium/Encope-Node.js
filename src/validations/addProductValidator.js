const {check, body} = require('express-validator');
const db = require("../database/models");

module.exports = [

    body('nombre')
    .notEmpty().withMessage('Debes ingresar un nombre').bail()
    .isLength({min:5, max:200}).withMessage('El nombre debe tener entre 5 y 200 carácteres').bail()
    .isAlpha('es-ES',{
        ignore:" "
    }).withMessage("Solo carácteres alfabéticos").bail()
    .custom((value, {req}) =>{

        if(req.params.id){
            return true
        } else {
            return db.Producto.findOne({
                where:{
                    nombre:value
                }
            }).then(producto => {
                if(producto){
                    return Promise.reject()
                }
            }).catch(error => {
                console.log(error);
                return Promise.reject('El Producto ya existe en la base de datos')
            })      
        }       
    }),

    check('medida')
    .notEmpty().withMessage('La unidad de medida es requerida').bail()
    .isLength({min:3, max:200}).withMessage('La unidad de medida debe tener entre 5 y 200 carácteres').bail()
    .isAlpha('es-ES',{
        ignore:" "
    }).withMessage("Solo carácteres alfabéticos"),

    check('detalle')
    .notEmpty().withMessage('Debe ingresar el detalle del producto').bail()
    .isLength({min:20, max:500}).withMessage('El detalle tiene que tener entre 20 y 500 caracteres')
]