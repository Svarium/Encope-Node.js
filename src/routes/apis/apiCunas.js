const express = require('express');
const { allkits, allStock, allProducts, allEditors, generalStock } = require('../../controllers/apis/apiCunasControllers');
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



module.exports = router