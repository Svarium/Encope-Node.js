var express = require('express');
const { list, moreStock, estadisticas, updateStock } = require('../controllers/cunasController');
const addStockValidator = require('../validations/addStockValidator');
const updateStockValidator = require('../validations/updateStockValidator');
var router = express.Router();

// llego con /cunas

//accedo a la vista para la carga de stock y actualizacion
router.get('/listar', list);

//ruta par enviar el stock
router.post('/',addStockValidator, moreStock)

//Ruta para mostrar estadisticas sobre el stock
router.get('/estadistica', estadisticas)

//Ruta para sumar al stock
router.put('/addStock/:id', updateStockValidator ,updateStock)




module.exports = router;