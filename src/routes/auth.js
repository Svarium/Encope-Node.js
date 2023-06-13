const express = require('express');
const passport = require('passport');
const { loginGoogle } = require('../controllers/authController');
const router = express.Router();

/* /auth/google */

router.get('/login/google', passport.authenticate('google'));
router.get(
    '/google/callback',
     passport.authenticate('google', {failureRedirect:'/users/login'}),
     loginGoogle
     );




module.exports = router;