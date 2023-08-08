const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const bcrypt = require('bcrypt')
const path = require('path');
const { Op } = require("sequelize");

const db = require('../database/models')

module.exports = {

    register : (req,res) =>{
        const userLogin = req.session.userLogin
        return res.render('register',{
            title: 'Registrate',
            userLogin
        })
    },
    
    processRegister: (req,res)=>{
        const userLogin = req.session.userLogin

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

        if(errors.isEmpty()){

            const {name, surname, email, password} = req.body

            db.Usuario.create({
                name : name.trim(),
                surname : surname.trim(),
                email: email.trim(),
                password : hashSync(password, 12),
                rolId: 6,
                icon: req.file ? req.file.filename : "not image.png",
            }).then(user =>{

                req.session.userLogin = {
                    id : user.id, 
                    name : user.name,
                    rol: user.rolId,
                    icon : user.icon,
                };

                if (req.body){
                    res.cookie('userEncopeWeb', req.session.userLogin, {maxAge: 1000*60*7})
                }

                res.redirect('/users/perfil')
            })
            .catch(error => console.log(error))

        } else{

          
            
            return res.render('register',{
                errors : errors.mapped(),
                old : req.body,
                title: 'Registrate',
                userLogin
            })
        }
           
    },

    login : (req,res) =>{
        const userLogin = req.session.userLogin
        return res.render('login',{
            title : "inicia sesión",
            userLogin
        })
    },

    processLogin: (req,res) =>{
   
        const errors = validationResult(req);
      /*   return res.send(errors.mapped()) */

      if(errors.isEmpty()){
        const {email} = req.body
        db.Usuario.findOne({
            where : {
                email 
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
                res.cookie('userEncopeWeb', req.session.userLogin, {maxAge : 100*60*7})
            }
            
           
            return res.redirect('/users/perfil')

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
            const userLogin = req.session.userLogin
      
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

                
      
                const { name, surname, credencial, destino } = req.body;
                const userSession = req.session.userLogin
                const user = await db.Usuario.findByPk(userSession.id)
    
                user.name= name,
                user.surname= surname,
                user.credencial= user.credencial? +user.credencial : +credencial,
                user.destinoId= destino ? +destino : user.destinoId,
                user.icon= req.file ? req.file.filename : userSession.icon
                
                await user.save()
    
                req.session.userLogin = {
                  ...userSession,
                  name: user.name,
                  icon: user.icon
                };

                if (req.cookies.userEncopeWeb){
                  res.cookie('userEncopeWeb', '', { maxAge: -1 });
                  res.cookie('userEncopeWeb', req.session.userLogin, {maxAge: 1000*60*7});
                }
    
               
                if(req.file){
                    fs.existsSync(path.join(__dirname,`../../public/images/iconsProfile/${userSession.icon}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/iconsProfile/${userSession.icon}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
                }
                
                return res.redirect('/users/perfil');
                
              } else {
    
                const usuario = db.Usuario.findByPk(req.session.userLogin.id,{
                    attributes : ['name', 'surname', 'email', 'icon'],
                    include : ['rol', 'destino']
                })
                const destino = db.destinoUsuario.findAll({
                    attributes : ['id', 'nombreDestino'],
                    order :[['nombreDestino']]
                })
        
                Promise.all([usuario, destino])
                .then(([usuario, destino])=>{
                    return res.render('perfil',{
                        usuario,
                        destino,
                        old:req.body,
                        errors: errors.mapped(),
                        title: "Perfil de usuario",
                        userLogin
                    })
                })      
                .catch(error => console.log(error))
              }
            } catch (error) {
              console.log(error);
            }
    },

    logout: (req, res) => {
        // Eliminar la sesión del usuario
        req.session.destroy((err) => {
          if (err) {
            console.error('Error al destruir la sesión:', err);
            // Puedes manejar el error de acuerdo a tus necesidades
          }
          
          // Eliminar la cookie que almacena los datos de sesión
          res.clearCookie('userEncopeWeb');
      
          // Redirigir al usuario a la página de inicio o a una página de confirmación de logout
          return res.redirect('/');
        });
      },

    perfil: (req,res) =>{
        const userLogin = req.session.userLogin        

        const usuario = db.Usuario.findByPk(req.session.userLogin.id,{
            attributes : ['name', 'surname', 'email', 'icon', 'id', 'credencial', 'destinoId'],
            include : ['rol', 'destino']
        })
        const destino = db.destinoUsuario.findAll({
            attributes : ['id', 'nombreDestino'],
            order :[['nombreDestino']]
        })

        Promise.all([usuario, destino])
        .then(([usuario, destino])=>{
            
            return res.render('perfil',{
                usuario,
                destino,
                title: "Perfil de usuario",
                userLogin               
            }            
            )
        })      
        .catch(error => console.log(error))     
    },

    dashboard : (req,res) =>{   
        const userLogin = req.session.userLogin    
            return res.render('dashboard',{
                title: "Panel de administración",
                userLogin
             
            })
      
    },
    editRol : async (req,res) => {


        try {

            const user = await db.Usuario.findByPk(req.body.userId)

            user.rolId = req.body.nuevoRol

            user.save()
            return res.redirect('/users/dashboard')
         
        } catch (error) {
            console.log(error);
        }
  
         
    },                       
      searchUser : (req,res) => {
        const userLogin = req.session.userLogin
        const query = req.query.search;
        db.Usuario.findAll({
            where : {
                email : {
                    [Op.like] : `%${query}%`
                }
            },
            include : ['rol', 'destino']
        })
        .then(users => {
            return res.render('searchUser',{
                users,
                title : 'Resultado de la busqueda',
                userLogin
            })
        })
        .catch(error => console.log(error))
      }

}