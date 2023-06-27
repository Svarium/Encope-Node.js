const express = require('express');
const { allLicitacion } = require('../../controllers/apis/apiLicitacionControllers');
const router = express.Router();

/* Llego con /api/licitacion */

//api que lista todas las licitaciones paginadas
router.get('/', allLicitacion)


module.exports = router;