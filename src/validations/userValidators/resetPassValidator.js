const { body, check } = require('express-validator');
const {compareSync} = require('bcryptjs');
const db = require('../../database/models')


module.exports = [

// Validación para la contraseña actual

check('email')
        .notEmpty().withMessage('El email es obligatorio').bail()
        .isEmail().withMessage('El email tiene un formato incorrecto'),

body('oldPass')
    .notEmpty()
    .withMessage('La contraseña actual es requerida')
    .custom((value, {req}) => {

        return db.Usuario.findOne({
            where : {
                email : req.body.email
            }
        }).then(user => {
            if(!user || !compareSync(value, user.password)){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('Contraseña antigua incorrecta'))
       
    }),
     

// Validación para la nueva contraseña
body('newPass')
    .notEmpty()
    .withMessage('La nueva contraseña es requerida').bail()
    .isLength({ min: 6 })
    .withMessage('La contraseña debe tener al menos 6 caracteres').bail()
    .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,12}$/)
    .withMessage('La contraseña debe contener al menos un número, una letra minúscula y una letra mayúscula')
    .custom((value, {req}) => {

        return db.Usuario.findOne({
            where : {
                email : req.body.email
            }
        }).then(user => {
            if(compareSync(value, user.password)){
                return Promise.reject()
            }
        }).catch(error => Promise.reject('Contraseña antigua incorrecta'))
       
    }),

]