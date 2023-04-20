const express = require('express');
const router = express.Router();
const { agregar, store, list, edit, update, remove } = require('../controllers/licitacionController');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const checkUserLogin = require('../middlewares/checkUserLogin');
const { uploadLicitacionesFiles } = require('../middlewares/subirLicitacion');
const licitacionValidator = require('../validations/licitacionValidator');
const editLicitacionValidator = require('../validations/editLicitacionValidator');
const checkUserEditor = require('../middlewares/checkUserEditor');




/* llego con /licitacion */

// listar publicaciones

router.get('/listar', list)

//CRUD

//Agregar Licitacion:

router.get('/agregar', checkUserEditor ,agregar)
router.post('/agregar',uploadLicitacionesFiles.single('pdf'), licitacionValidator, store)

//Editar publicación:
router.get('/editar/:id',checkUserEditor, edit)
router.put('/editar/:id',uploadLicitacionesFiles.single('pdf'),editLicitacionValidator, update)


//Eliminar publicación:
router.delete('/eliminar/:id', remove)


module.exports = router