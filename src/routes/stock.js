var express = require('express');
const { list, estadisticas, descargarTablaStock, descargarTablaRetirosStock, descargarTablaStockCPFII, newProduct, storageProduct, listProducts, editProduct, updateProduct, deleteProduct, searchProduct } = require('../controllers/stockController');

const checkUserEditorIntranet = require('../middlewares/checkUserEditorIntranet');
const { uploadProductosFiles } = require('../middlewares/subirProductos');
const addProductValidator = require('../validations/addProductValidator');

var router = express.Router();

// llego con /stock

//accedo a la vista para la carga de productos, talleres y proyectos
router.get('/', checkUserEditorIntranet, list);


/* PRODUCTOS */

//crud productos
router.get('/newProduct', newProduct)
router.post('/newProduct', uploadProductosFiles.single('producto'),addProductValidator, storageProduct)
router.get('/products', listProducts)
router.get('/editProduct/:id', editProduct)
router.put('/editProduct/:id',uploadProductosFiles.single('producto'),addProductValidator, updateProduct)
router.delete('/delete/:id', deleteProduct)
router.get('/searchProduct', searchProduct)


module.exports = router;