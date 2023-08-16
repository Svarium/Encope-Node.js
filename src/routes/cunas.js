var express = require('express');
const { list, moreStock } = require('../controllers/cunasController');
const addStockValidator = require('../validations/addStockValidator');
var router = express.Router();

// llego con /cunas

router.get('/listar', list);
router.post('/',addStockValidator, moreStock)



module.exports = router;