const db = require('../database/models')

module.exports = {
    loginGoogle: async (req,res ) => {
        const {
            provider,
            _json:{
                sub:googleId,
                given_name:name, 
                family_name:surname, 
                picture,
                email
            }
        } = req.session.passport.user

        try {
        const [user, isCreate] = await db.Usuario.findOrCreate({
                where: {
                   socialId:googleId
                },
                defaults:{
                    name,
                    surname,
                    email,         
                    icon: picture,   
                    socialId:googleId,
                    socialProvider: provider,
                    rolId:7
                }
               });

               req.session.userLogin = {
                id:user.id,
                name,
                rol:user.rolId,
                icon:user.icon,
                socialId:googleId,
                destinoId:user.destinoId ? user.destinoId : null
               }

               res.cookie('userEncopeWeb', req.session.userLogin, {maxAge: 1000*60*7})

               if(req.session.userLogin && req.session.userLogin.rol == 5){
                return res.redirect('/cunas/listar')
               } else if(req.session.userLogin && req.session.userLogin.rol == 6) {
                return res.redirect('/cunas/estadistica')
               } else {
                return res.redirect('/users/perfil')
               }

            
               
        } catch (error) {
            console.log(error);
        }       
    },
};