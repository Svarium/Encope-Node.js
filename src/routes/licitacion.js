const express = require('express');
const router = express.Router();
const { agregar, store, list } = require('../controllers/licitacionController');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const checkUserLogin = require('../middlewares/checkUserLogin');
const { uploadLicitacionesFiles } = require('../middlewares/subirLicitacion');
const licitacionValidator = require('../validations/licitacionValidator');




/* llego con /licitacion */

// listar publicaciones

router.get('/listar', list)


//CRUD Licitaciones

router.get('/agregar', agregar)
router.post('/agregar',uploadLicitacionesFiles.single('pdf'), licitacionValidator, store)
router.put('/editar')
router.delete('/eliminar')


module.exports = router