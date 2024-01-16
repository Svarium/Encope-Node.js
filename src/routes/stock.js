var express = require('express');
const { list, estadisticas, descargarTablaStock, descargarTablaRetirosStock, descargarTablaStockCPFII, newProduct, storageProduct, listProducts, editProduct, updateProduct, deleteProduct, searchProduct, productsTableExcel } = require('../controllers/productsController');
const { uploadProductosFiles } = require('../middlewares/subirProductos');
const addProductValidator = require('../validations/addProductValidator');
const checkUserEditorIntranetCentral = require('../middlewares/checkUserEditorIntranetCentral');
const { newTaller, storageTaller } = require('../controllers/talleresController');
const addTallerValidator = require('../validations/addTallerValidator');


var router = express.Router();

// llego con /stock

//accedo a la vista para la carga de productos, talleres y proyectos
router.get('/', checkUserEditorIntranetCentral, list);


/* PRODUCTOS */

//crud productos
router.get('/newProduct',checkUserEditorIntranetCentral,  newProduct)
router.post('/newProduct', uploadProductosFiles.single('producto'),addProductValidator,checkUserEditorIntranetCentral,storageProduct)
router.get('/products', checkUserEditorIntranetCentral , listProducts)
router.get('/editProduct/:id',checkUserEditorIntranetCentral, editProduct)
router.put('/editProduct/:id',uploadProductosFiles.single('producto'),addProductValidator,checkUserEditorIntranetCentral, updateProduct)
router.delete('/delete/:id',checkUserEditorIntranetCentral ,deleteProduct)
router.get('/searchProduct', checkUserEditorIntranetCentral , searchProduct)
router.get('/ProductsTable',checkUserEditorIntranetCentral ,productsTableExcel)



/* TALLERES */

//crud talleres

router.get('/newTaller', newTaller)
router.post('/newTaller',addTallerValidator, storageTaller)


module.exports = router;