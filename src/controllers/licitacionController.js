const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");

const db = require("../database/models")


module.exports = {

    list : (req,res) => {

    db.Publicaciones.findAll({
        include : ['tipo']
    })
    .then(publicaciones =>{
       
        return res.render('licitaciones',{
            title: 'Licitaciones',
            publicaciones
        })
    })
    .catch(error => console.log(error))


       
    },


    agregar : (req,res) => {

        db.Tipos.findAll({
            order : [['nombre']],
        })
        .then(tipos =>{
            /* return res.send(tipos) */
            return res.render('agregarLic',{
                title: 'Nueva Publicación',
                tipos
            })
        })
        .catch(error => console.log(error))
    },

    store : (req,res) => {

        const errors = validationResult(req)

      

       if(req.fileValidationError){ //este if valida que solo se puedan subir extensiones (pdf)
        errors.errors.push({
            value : "",
            msg : req.fileValidationError,
            param : "pdf",
            location : "file"
        })
    }

          if(!req.file){  //este if valida que se suba un pdf
        errors.errors.push({
            value : "",
            msg : "Debe subir el archivo",
            param : "pdf",
            location : "file"
        })

        
    } 

    if(errors.isEmpty()){

        const {expediente, titulo, objetivo, tipo} = req.body

        db.Publicaciones.create({
            expediente: expediente.trim(),
            titulo: titulo.trim(),
            objetivo: objetivo.trim(),
            tipoId: tipo,
            archivo: req.file ? req.file.filename : null
        })
        .then(publicacion =>{
            return res.redirect('/licitacion/listar')
        })
        .catch(error => console.log(error))

    } else {

    /*     if(req.file){
            fs.existsSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) //SI HAY ERROR Y CARGÓ ARCHIVO ESTE METODO LO BORRA
        } */

        db.Tipos.findAll({
            order : [['nombre']],
        })
        .then(tipos =>{
            /* return res.send(tipos) */
            return res.render('agregarLic',{
                title: 'Nueva Publicación',
                tipos,
                errors : errors.mapped(),
                old : req.body
            })
        })
        .catch(error => console.log(error))


    }


    }


}