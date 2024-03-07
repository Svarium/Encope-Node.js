const express = require('express');
const { editState, addRemanentes, allProducts, allTallers, allProyectsDone, lastProyects, updateCantidadAProducir, updateCostoUnitario, eliminarProducto, agregarProducto, cantidadProducida, egresos, observaciones } = require('../../controllers/apis/apiStockControllers');

const router = express.Router();

//llego con api/stock

router.put('/editState/:id', editState) //edita el estado del proyecto

router.put('/remanentes/:id', addRemanentes) //edita el remanente de un parte semanal

router.get('/getProducts', allProducts) //me trae una consulta contando la cantidad de productos en la base de datos

router.get('/getTalleres', allTallers) //me trae una consulta que me cuenta la cantidad de tallers en la base de datos

router.get('/getProyectsDone', allProyectsDone) // Me trae una consulta que cuenta la cantidad de proyectos terminados

router.get('/getLastProyects', lastProyects) //me trae una consulta con los ultimos 9 proyectos agregados

router.put('/editCantidad/:id', updateCantidadAProducir) // edito la cantidad a producir y sus tablas relacionadas

router.put('/editCosto/:id', updateCostoUnitario) // edito el costoUnitario y sus tablas relacionadas

router.delete('/deleteProduct/:id', eliminarProducto) // Elimino el producto del proyecto y actualizo las tablas relacionadas

router.post('/newProduct', agregarProducto) //agrego nuevo producto al proyecto

router.put('/cantidadProducida/:id', cantidadProducida) //edito la cantidad producida

router.put('/egresos/:id', egresos) //actualizo los egresos

router.put('/observaciones/:id', observaciones) //actualizo las observaciones









module.exports = router