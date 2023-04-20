const { check, body } = require('express-validator');
const db = require("../database/models")

module.exports = [

    body('expediente')
    .notEmpty().withMessage('Debe ingresar el número de expediente').bail()
    .isLength({min:5, max:35}).withMessage('El expediente tiene entre 5 y 35 carácteres'),
 /*    .isAlpha('es-ES', {
        ignore: " "
    }).withMessage('Solo caracteres alfabéticos'), */

    check('titulo')
    .notEmpty().withMessage('Debe ingresar el nombre de la publicacion'),


    check('objetivo')
    .notEmpty().withMessage('Debe ingresar el detalle de la publicación').bail()
    .isLength({min:10, max:255}).withMessage('El detalle puede tener entre 10 y 255 caracteres'),


    check('tipo')
    .notEmpty().withMessage('¿Que tipo de publicación es?')


]