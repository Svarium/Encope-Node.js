var express = require('express');
var router = express.Router();

const {home,inicio, nosotros, licitaciones, interno, contacto} = require('../controllers/mainController')

/* / */
router.get('/', home);
router.get('/inicio', inicio);
router.get('/nosotros', nosotros);
router.get('/licitaciones', licitaciones);
router.get('/interno', interno);
router.get('/contacto', contacto);

module.exports = router;
