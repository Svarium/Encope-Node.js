const express = require('express');
const { allkits, allStock, allProducts, allEditors, generalStock, cantidadValidaKit, validarRetiroDeStock } = require('../../controllers/apis/apiCunasControllers');
const router = express.Router();

//llego con api/cunas

// endpoit para traer el total de kits de terminados
router.get('/kits', allkits)

//endpoint para traer el total de stocks por unidad
router.get('/stocks', allStock)

//endpoint para listar la cantidad de productos
router.get('/productos', allProducts)

//endpoint para listar los usuarios editores
router.get('/editores', allEditors)

//endpoint para listar todo el stock 
router.get('/allStock', generalStock)

//endpoint para validar la cantidad correcta de kits
router.post('/cantidadKit', cantidadValidaKit)

//endpoint para validar la cantidad correcta de retiros de stock
router.post('/retiroStock/:id', validarRetiroDeStock)



module.exports = router