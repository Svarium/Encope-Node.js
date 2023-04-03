const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const { log } = require('console');
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

            console.log(req.fileValidationError);
            return res.send(errors.mapped())
    }


}