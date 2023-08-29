var express = require('express');
const { list, moreStock, estadisticas, updateStock, retiros, retirarStock, buscarStock } = require('../controllers/cunasController');
const addStockValidator = require('../validations/addStockValidator');
const updateStockValidator = require('../validations/updateStockValidator');
const checkUserEditorIntranet = require('../middlewares/checkUserEditorIntranet');
const retirarStockValidator = require('../validations/retirarStockValidator');
const checkUserEditorCunas = require('../middlewares/checkUserEditorCunas');
const buscarStockValidator = require('../validations/buscarStockValidator');
var router = express.Router();

// llego con /cunas

//accedo a la vista para la carga de stock y actualizacion
router.get('/listar', checkUserEditorIntranet, list);

//ruta par enviar el stock
router.post('/',addStockValidator, moreStock)

//Ruta para mostrar estadisticas sobre el stock
router.get('/estadistica',checkUserEditorCunas, estadisticas)

//Ruta para sumar al stock
router.put('/addStock/:id', updateStockValidator ,updateStock)

//Ruta para la vista de retiros de stock
router.get('/retiros', checkUserEditorCunas, retiros)

//Ruta retirar del stock
router.post('/retiros/:id', retirarStockValidator, retirarStock)

//Ruta para el buscador de stock
router.post('/buscarStock',buscarStockValidator, buscarStock )



module.exports = router;