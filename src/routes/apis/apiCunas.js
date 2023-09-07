const express = require('express');
const { allkits, allStock, allProducts, generalStock, cantidadValidaKit, validarRetiroDeStock, kitsEntregados } = require('../../controllers/apis/apiCunasControllers');
const router = express.Router();

//llego con api/cunas

// endpoit para traer el total de kits de terminados
router.get('/kits', allkits)

//endpoint para traer el total de stocks por unidad
router.get('/stocks', allStock)

//endpoint para listar la cantidad de productos
router.get('/productos', allProducts)

//endpoint para listar los usuarios editores
router.get('/kitsOuts', kitsEntregados)

//endpoint para listar todo el stock 
router.get('/allStock', generalStock)

//endpoint para validar la cantidad correcta de kits
router.post('/cantidadKit', cantidadValidaKit)

//endpoint para validar la cantidad correcta de retiros de stock
router.post('/retiroStock', validarRetiroDeStock)



module.exports = router