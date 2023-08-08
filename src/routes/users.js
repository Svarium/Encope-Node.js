var express = require('express');
const { register, processLogin, processRegister, login, logout, perfil, dashboard, updateUser, editRol, searchUser, resetPass, restetUserPass } = require('../controllers/userController');
const { uploadIconImage } = require('../middlewares/iconProfile');
const registerValidator = require('../validations/registerValidator');
const loginValidator = require('../validations/loginValidator');
const checkUser = require('../middlewares/checkUser');
const checkUserLogin = require('../middlewares/checkUserLogin');
const checkUserAdmin = require('../middlewares/checkUserAdmin');
const updateUserValidator = require('../validations/updateUserValidator');
const resetPassUsersValidator = require('../validations/resetPassUsersValidator');
const resetPassValidator = require('../validations/resetPassValidator');
var router = express.Router();

/* llego con /users*/


/* registrar usuario */
router.get('/register',checkUser, register)
router.post('/register', uploadIconImage.single('icon'),registerValidator, processRegister)

/* Loguear usuario */

router.get('/login',checkUser, login)
router.post('/login', loginValidator, processLogin)
router.get('/logout', logout)

/*perfil y dashboard  */
router.get('/perfil', checkUserLogin, perfil)
router.get('/dashboard',checkUserAdmin, dashboard)

/* editar un usuario */
router.put('/update/:id',uploadIconImage.single('icon'), updateUserValidator, updateUser)


/* Editar Rol de usuario */
router.post('/rol', editRol)
router.put('/rolUser/:id', editRol)

/* Buscar un usuario */

router.get('/search',checkUserLogin, searchUser)

/* Resetear password de usuarios por parte de los admins */
router.put('/resetPassUsers/:id',resetPassUsersValidator, resetPass)

/* Resetear password por parte del usuario */
router.put('/resetPass/:id', resetPassValidator, restetUserPass)



module.exports = router;
