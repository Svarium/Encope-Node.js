const express = require('express');
const { verifyEmail, allUsers, verifyPass } = require('../../controllers/apis/apiUsersControllers');
const router = express.Router()

/* llego con /api/users */

//api que me lista los usuarios con paginado
router.get('/', allUsers)

//api que verifica en tiempo real que exista el mail en la base de datos
router.post('/verify-email', verifyEmail)


//Verifica en tiempo real la contraseña del usuario

router.post('/verify-pass', verifyPass)




module.exports = router;