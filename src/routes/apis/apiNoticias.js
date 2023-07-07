const express = require('express');
const { allNoticias } = require('../../controllers/apis/apiNoticiasController');
const router = express.Router()


//llego con  api/noticias

//listar todas las noticias con paginado
router.get('/', allNoticias)


module.exports = router;