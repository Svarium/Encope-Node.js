var express = require('express');
const { register, processLogin, processRegister } = require('../controllers/userController');
const { uploadIconImage } = require('../middlewares/iconProfile');
const registerValidator = require('../validations/registerValidator');
var router = express.Router();

/* GET users listing. */
router.get('/register', register)
router.post('/register', uploadIconImage.single('icon'),registerValidator, processRegister)










module.exports = router;
