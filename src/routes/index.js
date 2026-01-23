var express = require('express');
var router = express.Router();

const {home, inicio, nosotros, contacto, mapa, unidadDetail, nuestrosProyectos, } = require('../controllers/mainController')

/* / */
router.get('/', home);
router.get('/inicio', inicio);
router.get('/nosotros', nosotros);
router.get('/contacto', contacto)
//router.get('/mapa', mapa)
//router.get('/mapa/detalle/:id', unidadDetail)
router.get('/proyectos', nuestrosProyectos)


module.exports = router;
