const express = require('express');
const { allkits, allStock } = require('../../controllers/apis/apiCunasControllers');
const router = express.Router();

//llego con api/cunas

// endpoit para traer el total de kits de terminados
router.get('/kits', allkits)

//endpoint para traer el total de stocks por unidad
router.get('/stocks', allStock)



module.exports = router