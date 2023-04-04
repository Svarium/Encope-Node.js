var express = require('express');
const { register, processLogin, processRegister, login, logout } = require('../controllers/userController');
const { uploadIconImage } = require('../middlewares/iconProfile');
const registerValidator = require('../validations/registerValidator');
const loginValidator = require('../validations/loginValidator');
var router = express.Router();

/* GET users listing. */
router.get('/register', register)
router.post('/register', uploadIconImage.single('icon'),registerValidator, processRegister)
router.get('/login', login)
router.post('/login', loginValidator, processLogin)
router.get('/logout', logout)











module.exports = router;
