const {check, body} = require('express-validator');
const {compareSync} = require('bcryptjs');
const db = require('../../database/models')
module.exports = [
    check('email')
        .notEmpty().withMessage('El email es obligatorio').bail()
        .isEmail().withMessage('El email tiene un formato incorrecto'),
    
    body('password')
        .notEmpty().withMessage('La contraseña es obligatoria').bail()
        .custom((value, {req}) => {

            return db.Usuario.findOne({
                where : {
                    email : req.body.email
                }
            }).then(user => {
                if(!user || !compareSync(value, user.password)){
                    return Promise.reject()
                }
            }).catch(error => Promise.reject('Credenciales inválidas'))
           
        })
]