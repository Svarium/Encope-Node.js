const {check, body} = require('express-validator');
const db = require("../database/models")


module.exports = [

    body('nombre')
    .notEmpty().withMessage('El nombre es requerido').bail()
    .isLength({min:5, max:200}).withMessage('El nombre debe tener entre 5 y 200 carácteres').bail()
    .isAlpha('es-ES', {
        ignore:" "
    }).withMessage("Solo carácteres alfabéticos"),

    check('expediente')
    .notEmpty().withMessage('Debe ingresar el numero de expediente').bail()
    .matches(/^EX-\d{4}-\d{9}-APN-DS#[A-Z0-9]+$/)
    .withMessage('El formato del expediente no es correcto. Ejemplo: EX-2023-114492446-APN-DS#ENCOPE').bail()
    .custom((value, {req}) => {

        if(req.params.id){
            return true
        } else {
            return db.Proyecto.findOne({
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
       
    }),

    check('destino')
    .notEmpty().withMessage('Debe elegir un taller'),

    check('producto')
    .notEmpty().withMessage('Debe elegir un producto'),

    check('cantidad')
    .notEmpty().withMessage('Debe ingresar una cantidad'),

    check('insumos')
    .notEmpty().withMessage('Debes ingresar los insumos a utilizar').bail()
    .isLength({min:10, max:2000}).withMessage('Los insumos deben tener entre 10 y 2000 carácteres'),

    check('detalle')
    .notEmpty().withMessage('Debes ingresar la descripción del proyecto').bail()
    .isLength({min:10, max:1000}).withMessage('El detalle debe tener entre 10 y 1000 carácteres'),

    check('duracion')
    .notEmpty().withMessage('Debes ingresar la duración del proyecto'),

    check('unidadDuracion')
    .notEmpty().withMessage('Debes seleccionar la unidad de duración del proyecto'),

    check('costoUnitario')
    .notEmpty().withMessage('Debes ingresar el costo unitario del proyecto'),
]