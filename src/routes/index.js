var express = require('express');
var router = express.Router();

const {home, inicio, nosotros, contacto, mapa, } = require('../controllers/mainController')

/* / */
router.get('/', home);
router.get('/inicio', inicio);
router.get('/nosotros', nosotros);
router.get('/contacto', contacto)
router.get('/mapa', mapa)

module.exports = router;
