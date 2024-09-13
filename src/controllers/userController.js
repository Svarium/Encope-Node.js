const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const bcrypt = require('bcrypt')
const path = require('path');
const { Op } = require("sequelize");
const db = require('../database/models');


module.exports = {

    register : (req,res) =>{       
        return res.render('register',{
            title: 'Registrate',          
        })
    },
    
    processRegister: async (req, res) => {
        const errors = validationResult(req);

        // Validación de errores de imagen
        if (req.fileValidationError) {
            errors.errors.push({
                value: "",
                msg: req.fileValidationError,
                param: "icon",
                location: "file"
            });
        }

        if (!req.file) {
            errors.errors.push({
                value: "",
                msg: "Debes subir una imagen de perfil",
                param: "icon",
                location: "file"
            });
        }

        // Si no hay errores, continuar con el registro
        if (errors.isEmpty()) {
            const { name, surname, email, password } = req.body;

            try {
                // Crear el usuario en la base de datos
                const user = await db.Usuario.create({
                    name: name.trim(),
                    surname: surname.trim(),
                    email: email.trim(),
                    password: hashSync(password, 12),
                    rolId: 7,
                    icon: req.file ? req.file.filename : "not image.png"
                });

                // Almacenar los datos del usuario en la sesión
                req.session.userLogin = {
                    id: user.id,
                    name: user.name,
                    rol: user.rolId,
                    icon: user.icon
                };

                // Guardar la cookie si hay datos en el cuerpo de la petición
                if (req.body) {
                    res.cookie('userEncopeWeb', req.session.userLogin, { maxAge: 1000 * 60 * 7 });
                }

                // Redirigir según el rol del usuario
                switch (req.session.userLogin.rol) {
                    case 5:
                        return res.redirect('/cunas/listar');
                    case 6:
                        return res.redirect('/cunas/estadistica');
                    default:
                        return res.redirect('/users/perfil');
                }

            } catch (error) {
                console.error("Error al registrar usuario:", error);
                return res.status(500).send('Error interno del servidor');
            }
        } else {
            // Si hay errores, renderizar el formulario de registro con los errores y datos previos
            return res.render('register', {
                errors: errors.mapped(),
                old: req.body,
                title: 'Registrate'
            });
        }
    },

    login : (req,res) =>{        
        return res.render('login',{
            title : "inicia sesión",            
        })
    },

    processLogin: async (req, res) => {
        const errors = validationResult(req);
    
        if (errors.isEmpty()) {
          const { email } = req.body;
    
          try {
            // Buscar el usuario por su email
            const user = await db.Usuario.findOne({
              where: { email }
            });
    
            if (user) {
              const { id, name, rolId, icon, destinoId } = user;
    
              // Guardar la información del usuario en la sesión
              req.session.userLogin = {
                id,
                name,
                rol: rolId,
                icon,
                destinoId: destinoId 
              };
    
              // Crear cookie si "recordarme" está marcado
              if (req.body.rememberMe) {
                res.cookie('userEncopeWeb', req.session.userLogin, { maxAge: 1000 * 60 * 7 });
              }
    
              // Redirigir a la página de gestión web
              return res.redirect('/gestionweb');
            } else {
              // En caso de que no se encuentre el usuario
              return res.render('login', {
                title: 'Inicia sesión',
                errors: { email: { msg: 'Usuario no encontrado' } }
              });
            }
          } catch (error) {
            console.error('Error en el proceso de inicio de sesión:', error);
            return res.status(500).send('Error interno del servidor');
          }
        } else {
          // Si hay errores en la validación
          return res.render('login', {
            title: 'Inicia sesión',
            errors: errors.mapped()
          });
        }
      },

    updateUser: async (req, res) => {
        try {
          const userSession = req.session.userLogin;
          const errors = validationResult(req);
    
          // Manejar errores de validación de archivo
          if (req.fileValidationError) {
            errors.errors.push({
              value: '',
              msg: req.fileValidationError,
              param: 'icon',
              location: 'file',
            });
          }
    
          // Si no hay errores de validación, proceder a actualizar el usuario
          if (errors.isEmpty()) {
            const { name, surname, credencial, destino } = req.body;
            const user = await db.Usuario.findByPk(userSession.id);
    
            // Actualizar los campos del usuario
            user.name = name.trim();
            user.surname = surname.trim();
            user.credencial = credencial ? +credencial : user.credencial;
            user.destinoId = destino ? +destino : user.destinoId;
            user.icon = req.file ? req.file.filename : userSession.icon;
    
            await user.save();
    
            // Actualizar la sesión
            req.session.userLogin = {
              ...userSession,
              name: user.name,
              icon: user.icon,
              destino: user.destinoId || null,
            };
    
            // Actualizar la cookie si existe
            if (req.cookies.userEncopeWeb) {
              res.cookie('userEncopeWeb', '', { maxAge: -1 }); // Borrar la cookie anterior
              res.cookie('userEncopeWeb', req.session.userLogin, { maxAge: 1000 * 60 * 7 }); // Crear nueva cookie
            }
    
            // Si se ha subido un nuevo archivo, eliminar el antiguo
            if (req.file && userSession.icon) {
              const oldIconPath = path.join(__dirname, `../../public/images/iconsProfile/${userSession.icon}`);
              if (fs.existsSync(oldIconPath)) {
                fs.unlinkSync(oldIconPath);
              }
            }
    
            // Redirigir al perfil del usuario
            return res.redirect('/users/perfil');
    
          } else {
            // Si hay errores, renderizar el formulario con los errores
            const [usuario, destino] = await Promise.all([
              db.Usuario.findByPk(req.session.userLogin.id, {
                attributes: ['name', 'surname', 'email', 'icon'],
                include: ['rol', 'destino'],
              }),
              db.destinoUsuario.findAll({
                attributes: ['id', 'nombreDestino'],
                order: [['nombreDestino']],
              }),
            ]);
    
            return res.render('perfil', {
              usuario,
              destino,
              old: req.body,
              errors: errors.mapped(),
              title: 'Perfil de usuario',
              userLogin: userSession,
            });
          }
        } catch (error) {
          console.error('Error al actualizar el usuario:', error);
          return res.status(500).send('Error interno del servidor');
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
        
        const usuario = db.Usuario.findByPk(req.session.userLogin.id,{
            attributes : ['name', 'surname', 'email', 'icon', 'id', 'credencial', 'destinoId', 'updatedAt', 'socialProvider'],
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
                            
            }            
            )
        })      
        .catch(error => console.log(error))     
    },

    dashboard : (req,res) =>{ 
            return res.render('dashboard',{
                title: "Panel de administración",
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
        const query = req.query.search;
        db.Usuario.findOne({
            where : {
                email : {
                    [Op.like] : `%${query}%`
                }
            },
            include : ['rol', 'destino']
        })
        .then(user => {
            return res.render('searchUser',{
                user,
                title : 'Resultado de la busqueda',          
            })
        })
        .catch(error => console.log(error))
      },

    resetPass : (req,res) => {                /*Este método es para que los administradores puedan blaquear la clave de un usuario despues de buscarlo a través del buscador */
        const errors = validationResult(req)       
        if(errors.isEmpty()){
            db.Usuario.update({
                password: bcrypt.hashSync(req.body.newPass,12)
            },{
                where:{
                    id:req.params.id
                }
            }).then(user => {
                return res.redirect('/users/dashboard')
            }).catch(error => console.log(error))
        } else {        
        const query = req.query.search;
        db.Usuario.findOne({
            where : {
                email : {
                    [Op.like] : `%${query}%`
                }
            },
            include : ['rol', 'destino']
        })
        .then(user => {
            return res.render('searchUser',{
                user,
                title : 'Resultado de la busqueda',               
                errors:errors.mapped(),
                old:req.body
            })
        })
        .catch(error => console.log(error))
        }        
      },

    restetUserPass : (req,res) => { /* este método se encarga del reseto de la password del usuario */

        const errors = validationResult(req);

        if(errors.isEmpty()){
            db.Usuario.update({
                password:bcrypt.hashSync(req.body.newPass,12),
               },
               {
                where:{
                    id:req.params.id
                }
               }).then(() => {
                return res.redirect('/users/perfil');
               }).catch(error => console.log(error))
        } else {   
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
                    errors:errors.mapped(),
                    old:req.body               
                }            
                )
            })      
            .catch(error => console.log(error))     
        }      
      },

    destroy: (req,res) => {
        db.Usuario.destroy({
            where:{id:req.params.id},
            force:true
        }).then(() => {
            return res.redirect('/users/dashboard')
        })
        .catch(error => console.log(error))
      }

}