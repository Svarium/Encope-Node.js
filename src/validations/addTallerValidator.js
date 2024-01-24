const {check, body} = require('express-validator');
const db = require("../database/models");

module.exports = [

    body('nombre')
    .notEmpty().withMessage('Debes ingresar un nombre').bail()
    .isLength({min:5, max:200}).withMessage('El nombre debe tener entre 5 y 200 carácteres').bail()
    .isAlpha('es-ES',{
        ignore:" "
    }).withMessage("Solo carácteres alfabéticos"),    

    check('destino')
    .notEmpty().withMessage('Debe seleccionar una unidad de medida'),

    check('detalle')
    .notEmpty().withMessage('Debe ingresar el detalle del producto').bail()
    .isLength({min:20, max:500}).withMessage('El detalle tiene que tener entre 20 y 500 caracteres'),

    check('expediente')
    .notEmpty().withMessage('Debe ingresar el numero de expediente').bail()
    .matches(/^EX-\d{4}-\d{9}-APN-DS#[A-Z0-9]+$/)
    .withMessage('El formato del número de expediente no es válido').bail()
    .custom((value, {req}) => {

        if(req.params.id){
            return true
        } else {
            return db.Taller.findOne({
                where:{expediente:req.body.expediente}
            }).then(expediente => {
                if (expediente) {
                    return Promise.reject()
                }
            }).catch(error => {
                console.log(error);
                return Promise.reject('El expediente ya existe en la base de datos')
            })
        }      
       
    })
]