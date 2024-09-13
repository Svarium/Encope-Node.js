const express = require('express');
const { add, store, edit, update, detail, remove, destroy, list } = require('../controllers/noticiasController');
const { uploadNoticiasImages } = require('../middlewares/upload/subirNoticia');
const noticiaValidator = require('../validations/noticiasValidators/noticiaValidator');
const checkUserEditorNoticias = require('../middlewares/checkUsers/checkUserEditorNoticias');
const router = express.Router();

/* llego con /noticias */


//listar todas las noticias
router.get('/', list)

//Vista del detalle de la noticia
router.get('/detalle/:id', detail)

//Vista del formulario agregar noticias
router.get('/add', checkUserEditorNoticias,  add)

//Envío del formulario con data para la base de datos
router.post('/add', uploadNoticiasImages, noticiaValidator, store)

//Envio del formulario editar 
router.get('/edit/:id',checkUserEditorNoticias, edit)

//Envio la edicion de la noticia
router.put('/update/:id', uploadNoticiasImages, noticiaValidator, update)

//Eliminado de la noticia
router.delete('/delete/:id', destroy)



module.exports = router