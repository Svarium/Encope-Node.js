const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const { log, error } = require('console');

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
                icon: req.file.filename
            }).then(user =>{
                res.redirect('/users/login')
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

    logout: (req,res) =>{
        req.session.destroy();
        res.cookie('userEncopeWeb', null, {maxAge:-1})
        return res.redirect('/inicio')
    }

}