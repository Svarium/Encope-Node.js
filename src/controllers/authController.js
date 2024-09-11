const db = require('../database/models');
const { createSession } = require('../helpers/sessionHelper'); // Helper para manejar la sesión

module.exports = {
    loginGoogle: async (req, res) => {
        const { provider, _json: { sub: googleId, given_name: name, family_name: surname, picture, email } } = req.session.passport.user;

        try {
            const [user, isCreated] = await db.Usuario.findOrCreate({
                where: { socialId: googleId },
                defaults: {
                    name,
                    surname,
                    email,
                    icon: picture,
                    socialId: googleId,
                    socialProvider: provider,
                    rolId: 7
                }
            });

            // Crear sesión de usuario
            createSession(req, user);

            // Establecer cookie de sesión
            res.cookie('userEncopeWeb', req.session.userLogin, { maxAge: 1000 * 60 * 7 });

            return res.redirect('/gestionweb');
        } catch (error) {
            console.error('Error en login con Google:', error);
            return res.status(500).render('error', { 
                message: 'Hubo un problema con el inicio de sesión', 
                error
            });
        }
    },
};
