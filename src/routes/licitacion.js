const express = require('express');
const router = express.Router();
const { agregar, store } = require('../controllers/licitacionController');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const checkUserLogin = require('../middlewares/checkUserLogin');
const { uploadLicitacionesFiles } = require('../middlewares/subirLicitacion');
const licitacionValidator = require('../validations/licitacionValidator');




/* llego con /licitacion */


//CRUD Licitaciones

router.get('/agregar', agregar)
router.post('/agregar',uploadLicitacionesFiles.single('pdf'), licitacionValidator, store)
router.put('/agregar')
router.delete('/agregar')


module.exports = router