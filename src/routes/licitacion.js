const express = require('express');
const router = express.Router();
const { 
    agregar, 
    store, 
    list, 
    edit, 
    update, 
    remove, 
    verTodas, 
    search, 
    searchLicitacion 
} = require('../controllers/licitacionController');
const checkUserLogin = require('../middlewares/checkUsers/checkUserLogin');
const { uploadLicitacionesFiles } = require('../middlewares/upload/subirLicitacion');
const licitacionValidator = require('../validations/licitacionValidators/licitacionValidator');
const editLicitacionValidator = require('../validations/licitacionValidators/editLicitacionValidator');
const checkUserEditorLicitaciones = require('../middlewares/checkUsers/checkUserEditorLicitaciones');

/* Llego con /licitacion */

/* Listar publicaciones */
router.get('/listar', list);

/* Ver todas en el dashboard */
router.get('/publicaciones', checkUserEditorLicitaciones, verTodas);

/* Buscador de licitaciones por título, tomando en cuenta el query */
router.get('/search', checkUserLogin, search);

/* Buscador de licitaciones para usuarios comunes */
router.get('/searchLicitacion', searchLicitacion);

/* CRUD */

/* Agregar licitación */
router.get('/agregar', checkUserEditorLicitaciones, agregar);
router.post('/agregar', uploadLicitacionesFiles.single('pdf'), licitacionValidator, store);

/* Editar publicación */
router.get('/editar/:id', checkUserEditorLicitaciones, edit);
router.put('/editar/:id', uploadLicitacionesFiles.single('pdf'), editLicitacionValidator, update);

/* Eliminar publicación */
router.delete('/eliminar/:id', remove);

module.exports = router;
