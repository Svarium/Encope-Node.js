const express = require('express');
const { add, store } = require('../controllers/noticiasController');
const { uploadNoticiasImages } = require('../middlewares/subirNoticia');
const noticiaValidator = require('../validations/noticiaValidator');
const router = express.Router();

/* llego con /noticias */

//Vista del formulario agregar noticias
router.get('/add', add)

//Envío del formulario con data para la base de datos
router.post('/add', uploadNoticiasImages, noticiaValidator, store)



module.exports = router