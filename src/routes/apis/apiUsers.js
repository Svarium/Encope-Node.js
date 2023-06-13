const express = require('express');
const { verifyEmail } = require('../../controllers/apis/apiUsersControllers');
const router = express.Router()

/* llego con /api/users */

//api que verifica en tiempo real que exista el mail en la base de datos
router.post('/verify-email', verifyEmail)




module.exports = router;