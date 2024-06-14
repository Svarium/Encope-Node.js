const express = require('express');
const { createRegister } = require('../../controllers/apis/apiInsumosControllers');

const router = express.Router();

//llego con api/insumos

router.post('/addproyectoInsumo', createRegister)



module.exports = router