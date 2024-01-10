var express = require('express');
const { list, estadisticas, descargarTablaStock, descargarTablaRetirosStock, descargarTablaStockCPFII, newProduct, storageProduct } = require('../controllers/stockController');

const checkUserEditorIntranet = require('../middlewares/checkUserEditorIntranet');
const { uploadProductosFiles } = require('../middlewares/subirProductos');
const addProductValidator = require('../validations/addProductValidator');

var router = express.Router();

// llego con /stock

//accedo a la vista para la carga de stock y actualizacion
router.get('/listar', checkUserEditorIntranet, list);

//accedo a la vista con el formulario para crear un nuevo producto
router.get('/newProduct', newProduct)
router.post('/newProduct', uploadProductosFiles.single('producto'),addProductValidator, storageProduct)


module.exports = router;