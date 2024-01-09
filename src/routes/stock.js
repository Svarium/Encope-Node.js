var express = require('express');
const { list, moreStock, estadisticas, updateStock, retiros, retirarStock, buscarStock, registroRetiros, buscarStockPorDestino, retirarKits, entregarKit, descargarTablaStock, descargarTablaRetirosStock, descargarTablaStockCPFII } = require('../controllers/stockController');

const checkUserEditorIntranet = require('../middlewares/checkUserEditorIntranet');

var router = express.Router();

// llego con /stock

//accedo a la vista para la carga de stock y actualizacion
router.get('/listar', checkUserEditorIntranet, list);





module.exports = router;