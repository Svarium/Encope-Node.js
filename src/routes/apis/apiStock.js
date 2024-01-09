const express = require('express');
const { allkits, allStock, allProducts, generalStock, cantidadValidaKit, validarRetiroDeStock, kitsEntregados, ultimosRetiros } = require('../../controllers/apis/apiCunasControllers');
const router = express.Router();

//llego con api/cunas

// endpoit para traer el total de kits de terminados
router.get('/kits', allkits)

//endpoint para traer el total de stocks en CPFII
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

//endopoint para consultar los ultimos 10 retiros realizados en un destino
router.get('/ultimosRetiros/:id', ultimosRetiros)



module.exports = router