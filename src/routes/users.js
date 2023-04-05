var express = require('express');
const { register, processLogin, processRegister, login, logout, perfil } = require('../controllers/userController');
const { uploadIconImage } = require('../middlewares/iconProfile');
const registerValidator = require('../validations/registerValidator');
const loginValidator = require('../validations/loginValidator');
const checkUser = require('../middlewares/checkUser');
const checkUserLogin = require('../middlewares/checkUserLogin');
var router = express.Router();

/* GET users listing. */
router.get('/register',checkUser, register)
router.post('/register', uploadIconImage.single('icon'),registerValidator, processRegister)
router.get('/login',checkUser, login)
router.post('/login', loginValidator, processLogin)
router.get('/logout', logout)
router.get('/perfil', checkUserLogin, perfil)
router.get('/dashboard')











module.exports = router;
