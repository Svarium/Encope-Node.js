const express = require('express');
const { createRegister, createCantidadAdquirida, createNumeroFactura, createDetalleInsumo, calcularRemanentes, porcentajeAvance } = require('../../controllers/apis/apiInsumosControllers');
const addCantidadAdquiridaValidator = require('../../validations/api/insumos/addCantidadAdquiridaValidator');
const addNumeroFacturaValidator = require('../../validations/api/insumos/addNumeroFacturaValidator');
const addDetalleValidator = require('../../validations/api/insumos/addDetalleValidator');

const router = express.Router();

//llego con api/insumos

router.post('/addproyectoInsumo', createRegister) //crea el registro con los datos basicos 

router.post('/cantidadAdquirida/:id', addCantidadAdquiridaValidator, createCantidadAdquirida) //guarda el registro de la cantidad adquirida

router.post('/numeroFactura/:id', addNumeroFacturaValidator , createNumeroFactura) //guarda el registro del numero de la factura

router.post('/detalle/:id', addDetalleValidator, createDetalleInsumo) // guarda el registro del detalle

router.post('/calculoRemanentes/', calcularRemanentes) // Reporte en excel de los remanentes

router.post('/informeAvance', porcentajeAvance) //informes al 50% y al 100% del proyecto




module.exports = router