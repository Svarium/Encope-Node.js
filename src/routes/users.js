var express = require('express');
const { 
    register, 
    processLogin, 
    processRegister, 
    login, 
    logout, 
    perfil, 
    dashboard, 
    updateUser, 
    editRol, 
    searchUser, 
    resetPass, 
    restetUserPass, 
    destroy 
} = require('../controllers/userController');
const { uploadIconImage } = require('../middlewares/upload/iconProfile');
const registerValidator = require('../validations/userValidators/registerValidator');
const loginValidator = require('../validations/userValidators/loginValidator');
const checkUser = require('../middlewares/checkUsers/checkUser');
const checkUserLogin = require('../middlewares/checkUsers/checkUserLogin');
const checkUserAdmin = require('../middlewares/checkUsers/checkUserAdmin');
const updateUserValidator = require('../validations/userValidators/updateUserValidator');
const resetPassUsersValidator = require('../validations/userValidators/resetPassUsersValidator');
const resetPassValidator = require('../validations/userValidators/resetPassValidator');

var router = express.Router();

/* Llegada con /users */

/* Registrar usuario */
router.get('/register', checkUser, register);
router.post('/register', uploadIconImage.single('icon'), registerValidator, processRegister);

/* Loguear usuario */
router.get('/login', checkUser, login);
router.post('/login', loginValidator, processLogin);
router.get('/logout', logout);

/* Perfil y Dashboard */
router.get('/perfil', checkUserLogin, perfil);
router.get('/dashboard', checkUserAdmin, dashboard);

/* Editar un usuario */
router.put('/update/:id', uploadIconImage.single('icon'), updateUserValidator, updateUser);

/* Editar Rol de usuario */
router.post('/rol', editRol);
router.put('/rolUser/:id', editRol);

/* Buscar un usuario */
router.get('/search', checkUserLogin, searchUser);

/* Resetear contraseña de usuarios por parte de los admins */
router.put('/resetPassUsers/:id', checkUserAdmin, resetPassUsersValidator, resetPass);

/* Resetear contraseña por parte del usuario */
router.put('/resetPass/:id', resetPassValidator, checkUserLogin, restetUserPass);

/* Eliminar cuenta de usuario */
router.delete('/delete/:id', checkUserAdmin, destroy);

module.exports = router;
