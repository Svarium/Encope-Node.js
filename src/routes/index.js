var express = require('express');
var router = express.Router();

const {home,inicio, nosotros, interno} = require('../controllers/mainController')

/* / */
router.get('/', home);
router.get('/inicio', inicio);
router.get('/nosotros', nosotros);

router.get('/interno', interno);

module.exports = router;
