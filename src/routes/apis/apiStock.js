const express = require('express');
const { editState, addRemanentes } = require('../../controllers/apis/apiStockControllers');
const router = express.Router();

//llego con api/stock

router.put('/editState/:id', editState) //edita el estado del proyecto

router.put('/remanentes/:id', addRemanentes) //edita el remanente de un parte semanal





module.exports = router