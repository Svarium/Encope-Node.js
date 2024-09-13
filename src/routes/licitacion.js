const express = require('express');
const router = express.Router();
const { agregar, store, list, edit, update, remove, verTodas, search, searchLicitacion } = require('../controllers/licitacionController');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const checkUserLogin = require('../middlewares/checkUserLogin');
const { uploadLicitacionesFiles } = require('../middlewares/subirLicitacion');
const licitacionValidator = require('../validations/licitacionValidator');
const editLicitacionValidator = require('../validations/editLicitacionValidator');
const checkUserEditorLicitaciones = require('../middlewares/checkUserEditorLicitaciones');



/* llego con /licitacion */

// listar publicaciones

router.get('/listar', list)

// ver todas en el dashboard

router.get('/publicaciones',checkUserEditorLicitaciones, verTodas)

// buscardor de licitaciones por titulo tomando en cuenta el query

router.get('/search', checkUserLogin, search)

//Buscador de licitaciones para usuarios comunes

router.get('/searchLicitacion', searchLicitacion)

//CRUD

//Agregar Licitacion:

router.get('/agregar', checkUserEditorLicitaciones ,agregar)
router.post('/agregar',uploadLicitacionesFiles.single('pdf'), licitacionValidator, store)

//Editar publicación:
router.get('/editar/:id',checkUserEditorLicitaciones, edit)
router.put('/editar/:id',uploadLicitacionesFiles.single('pdf'),editLicitacionValidator, update)


//Eliminar publicación:
router.delete('/eliminar/:id', remove)


module.exports = router