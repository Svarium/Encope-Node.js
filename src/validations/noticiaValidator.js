const {check} = require('express-validator');

module.exports = [

check('titulo')
    .notEmpty().withMessage('El título de la noticia es obligatorio').bail()
    .isLength({min:5, max:50}).withMessage('El título debe tener entre 5 y 50 carácteres'),

check('video')
    .notEmpty().withMessage('Debe ingresar el link del video'),

check('descripcion')
.notEmpty().withMessage('Debe ingresar el cuerpo de la noticia').bail()
.isLength({min:10, max:1000}).withMessage('La descripción puede tener entre 10 y 1000 carácteres')  
]