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
    .matches(/^[0-9]+$/).withMessage('La credencial es invalida').bail()
    .isLength({min:5, max:5}).withMessage('Ingresa una credencial válida').bail()
    .custom((value, {req}) => {
        return db.Usuario.findOne({
            where :{
                credencial:value
            }
        }).then(user => {
            if(user){
                return Promise.reject()
            }
        }).catch((error) => {
            console.log(error);
            return Promise.reject('La credencial ya existe en la base de datos')
        })
    })
    ,

    ]