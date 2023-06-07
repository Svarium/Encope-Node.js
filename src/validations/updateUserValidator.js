const {check, body} = require('express-validator');
const db = require('../database/models');

module.exports = [
    check('name')
        .notEmpty().withMessage('El nombre es obligatorio').bail()
        .isLength({
            min: 2
        }).withMessage('Mínimo dos letras').bail()
        .isAlpha('es-ES',{
            ignore : " "
        }).withMessage('Solo caracteres alfabéticos'),

    check('surname')
        .notEmpty().withMessage('El apellido es obligatorio').bail()
        .isLength({
            min: 2
        }).withMessage('Mínimo dos letras').bail()
        .isAlpha('es-ES',{
            ignore : " "
        }).withMessage('Solo caracteres alfabéticos'),

    check('destino')
    .notEmpty().withMessage('El destino es obligatorio'),

    check('credencial')
    .notEmpty().withMessage('Ingresa tu credencial').bail()
    .isLength({min:5, max:5}).withMessage('Ingresa una credencial válida'),

    ]