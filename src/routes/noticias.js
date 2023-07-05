const express = require('express');
const { add, store, edit, update } = require('../controllers/noticiasController');
const { uploadNoticiasImages } = require('../middlewares/subirNoticia');
const noticiaValidator = require('../validations/noticiaValidator');
const checkUserEditorNoticias = require('../middlewares/checkUserEditorNoticias');
const router = express.Router();

/* llego con /noticias */

//Vista del formulario agregar noticias
router.get('/add', checkUserEditorNoticias,  add)

//Envío del formulario con data para la base de datos
router.post('/add', uploadNoticiasImages, noticiaValidator, store)

//Envio del formulario editar 
router.get('/edit/:id',checkUserEditorNoticias, edit)

//Envio la edicion de la noticia
router.put('/update/:id', uploadNoticiasImages, noticiaValidator, update)



module.exports = router