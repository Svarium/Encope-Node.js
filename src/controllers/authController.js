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
                    socialProvider: provider    
                }
               });

               req.session.userLogin = {
                id:user.id,
                name,
                rol:user.rolId,
                icon:user.icon,
                socialId:googleId
               }

               res.cookie('userEncopeWeb', req.session.userLogin, {maxAge: 1000*60*7})

               return res.redirect('/users/perfil')
               
        } catch (error) {
            console.log(error);
        }

       
    },
};