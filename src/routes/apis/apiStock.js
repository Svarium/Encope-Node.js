const express = require('express');
const { editState, addRemanentes, allProducts, allTallers, allProyectsDone, lastProyects, updateCantidadAProducir } = require('../../controllers/apis/apiStockControllers');

const router = express.Router();

//llego con api/stock

router.put('/editState/:id', editState) //edita el estado del proyecto

router.put('/remanentes/:id', addRemanentes) //edita el remanente de un parte semanal

router.get('/getProducts', allProducts) //me trae una consulta contando la cantidad de productos en la base de datos

router.get('/getTalleres', allTallers) //me trae una consulta que me cuenta la cantidad de tallers en la base de datos

router.get('/getProyectsDone', allProyectsDone) // Me trae una consulta que cuenta la cantidad de proyectos terminados

router.get('/getLastProyects', lastProyects) //me trae una consulta con los ultimos 9 proyectos agregados

router.put('/editCantidad/:id', updateCantidadAProducir)



module.exports = router