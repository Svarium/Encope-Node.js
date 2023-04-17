const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const bcrypt = require('bcrypt')
const { log, error } = require('console');
const path = require('path');

const db = require('../database/models')

module.exports = {

    register : (req,res) =>{
        return res.render('register',{
            title: 'Registrate'
        })

    },
    
    processRegister: (req,res)=>{

        const errors = validationResult(req);


        if(req.fileValidationError){ 
            errors.errors.push({
                value : "",
                msg : req.fileValidationError,
                param : "icon",
                location : "file"
            })
        }

        if (!req.file){ 
            errors.errors.push({ 
                value : "",
                msg : "Debes subir una imagen de perfil",
                param : "icon",
                location : "file"
            })
        }

      /*   console.log(req.fileValidationError);
            return res.send(errors.mapped()) */

        if(errors.isEmpty()){

            const {name, surname, email, password} = req.body

            db.Usuario.create({
                name : name.trim(),
                surname : surname.trim(),
                email: email.trim(),
                password : hashSync(password, 12),
                rolId: 3,
                icon: req.file ? req.file.filename : "not image.png",
            }).then(user =>{

                req.session.userLogin = {
                    id : user.id, 
                    name : user.name,
                    rol: user.rolId,
                    icon : user.icon,
                };

                if (req.body){
                    res.cookie('userEncopeWeb', req.session.userLogin, {maxAge: 1000*60*5})
                }

                res.redirect('/users/perfil')
            })
            .catch(error => console.log(error))

        } else{

          
            
            return res.render('register',{
                errors : errors.mapped(),
                old : req.body,
                title: 'Registrate'
            })
        }
           
    },

    login : (req,res) =>{
        return res.render('login',{
            title : "inicia sesión"
        })
    },

    processLogin: (req,res) =>{
        const errors = validationResult(req);

      /*   return res.send(errors.mapped()) */

      if(errors.isEmpty()){

        db.Usuario.findOne({
            where : {
                email : req.body.email
            }
        }) 
        .then(({id, name, rolId, icon})=>{
            req.session.userLogin = {
                id, 
                name,
                rol : rolId,
                icon 
            };

            if(req.body.rememberMe){
                res.cookie('userEncopeWeb', req.session.userLogin, {maxAge : 100*60*2})
            }

            
            return res.redirect('/inicio')

        })
        .catch(error => console.log(error))
      }else{
        res.render('login',{
            title : "inicia sesión",
            errors : errors.mapped()
        })
      }
    },

    updateUser: async (req,res) => {

        try {
      
            const errors = validationResult(req);
      
         
      
             if(req.fileValidationError){ //este if valida que solo se puedan subir extensiones (jpg|jpeg|png|gif|webp)
                 errors.errors.push({
                     value : "",
                     msg : req.fileValidationError,
                     param : "icon",
                     location : "file"
                 })
             }
      
             
      
          if(errors.isEmpty()){
                // manejo de errores de validación
      
                const { name, surname } = req.body;
                const userSession = req.session.userLogin
                const user = await db.Usuario.findByPk(userSession.id)
    
                user.name= name,
                user.surname= surname,
                user.icon= req.file ? req.file.filename : userSession.icon
                
                await user.save()
    
                req.session.userLogin = {
                  ...userSession,
                  name: user.name,
                  icon: user.icon
                };

                if (req.cookies.userEncopeWeb){
                  res.cookie('userGuaridaDelLector', '', { maxAge: -1 });
                  res.cookie('userEncopeWeb', req.session.userLogin, {maxAge: 1000*60*5});
                }
    
               
                if(req.file){
                    fs.existsSync(path.join(__dirname,`../../public/images/iconsProfile/${userSession.icon}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/iconsProfile/${userSession.icon}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
                }
                
                return res.redirect('/users/perfil');
                
              } else {
    
                db.Usuario.findByPk(req.session.userLogin.id,{
                    attributes : ['name', 'surname', 'email', 'icon'],
                    include : ['rol']
                })
                .then(usuario =>{
                   return res.render('perfil',{
                        usuario,
                        errors : errors.mapped(),
                        old : req.body,
                        title: 'Perfil de usuario'
                    })
                })
                .catch(error => console.log(error))
              }
            } catch (error) {
              res.send(error)
            }
    },

    updateUserRol: (req,res) =>{

    },

    logout: (req,res) =>{
        req.session.destroy();
        res.cookie('userEncopeWeb', null, {maxAge:-1})
        return res.redirect('/inicio')
    },

    perfil: (req,res) =>{

        db.Usuario.findByPk(req.session.userLogin.id,{
            attributes : ['name', 'surname', 'email', 'icon'],
            include : ['rol']
        })
        .then(usuario =>{
            return res.render('perfil',{
                usuario,
                title: "Perfil de usuario"
            })
        })
        .catch(error => console.log(error))


     
    },

    dashboard : (req,res) =>{
        db.Usuario.findAll({
            attributes:['name', 'surname', 'email', 'rolId'],
            include : ['rol']
        }
           
        )
        .then(usuarios =>{
            return res.render('dashboard',{
                title: "Panel de administración",
                usuarios
            })
        })
        .catch(error => console.log(error))
    }

}