const {check} = require('express-validator');
const db = require("../database/models")

module.exports = [   

    check('expedienteFicha')
    .notEmpty().withMessage('Debe ingresar el numero de expediente').bail()
    .matches(/^EX-\d{4}-\d{9}-APN-DS#[A-Z0-9]+$/)
    .withMessage('El formato del expediente no es correcto. Ejemplo: EX-2023-114492446-APN-DS#ENCOPE').bail()
    .custom((value, {req}) => {     
       
            return db.Producto.findOne({
                where:{expedienteFicha:req.body.expedienteFicha}
            }).then(expediente => {
                if (expediente) {
                    return Promise.reject()
                }
            }).catch(error => {
                console.log(error);
                return Promise.reject('El expediente ya existe en la base de datos')
            })
           
    }),]