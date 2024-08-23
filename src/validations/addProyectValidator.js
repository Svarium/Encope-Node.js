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
    .custom((value, {req}) => {

       
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
         
       
    }),

    check('destino')
    .notEmpty().withMessage('Debe elegir un taller'),
  

    check('detalle')
    .notEmpty().withMessage('Debes ingresar la descripción del proyecto').bail()
    .isLength({min:10, max:1000}).withMessage('El detalle debe tener entre 10 y 1000 carácteres'),

    check('duracion')
    .notEmpty().withMessage('Debes ingresar la duración del proyecto'),

    check('unidadDuracion')
    .notEmpty().withMessage('Debes seleccionar la unidad de duración del proyecto'),

  

    // Validaciones para campos dinámicos (cantidad y costo unitario)
    body('productos')
        .custom((productos, { req }) => {
            // Verificar si se han proporcionado productos
            if (!productos || !Array.isArray(productos) || productos.length === 0) {
                throw new Error('Debe elegir al menos un producto');
            }

            // Verificar si algún producto tiene campos vacíos
            const productoConCamposVacios = productos.find(producto => {
                return !producto.cantidad || !producto.costoUnitario;
            });

            // Si encontramos algún producto con campos vacíos, lanzar un error general
            if (productoConCamposVacios) {
                throw new Error('Debe completar todos los campos de los productos');
            }

            // Indicar que las validaciones han pasado correctamente
            return true;
        })

]