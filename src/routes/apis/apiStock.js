const express = require('express');
const { editState } = require('../../controllers/apis/apiStockControllers');
const router = express.Router();

//llego con api/stock

router.put('/editState/:id', editState)



module.exports = router