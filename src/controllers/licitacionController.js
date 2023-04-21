const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");

const db = require("../database/models")


module.exports = {

    list : (req,res) => {

    db.Publicaciones.findAll({
        order : [['id', 'DESC']],
        include : ['tipo'],
        
    })
    .then(publicaciones =>{
       
        return res.render('licitaciones',{
            title: 'Licitaciones',
            publicaciones
        })
    })
    .catch(error => console.log(error))


       
    },

    verTodas : (req,res) => {
        db.Publicaciones.findAll({
            include : ['tipo']
        })
        .then(publicaciones =>{
           
      /*       return res.send(publicaciones) */
            return res.render('adminLicitaciones',{
                title: 'Administrar Licitaciones',
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
            return res.redirect('/licitacion/publicaciones')
        })
        .catch(error => console.log(error))

    } else {

        if(req.file){
            fs.existsSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
        }

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


    },

    edit : (req,res) => {

        const {id} = req.params;

        const publicacion = db.Publicaciones.findByPk(id) //busco la publicación en la base

        const tipos =  db.Tipos.findAll() // busco los tipos para recorrerlos en el select del form

        Promise.all(([publicacion, tipos])) //engloba las dos promesas anteriores y las envia a la vista
        .then(([publicacion, tipos]) =>{
           /*  return res.send(tipos) */
            return res.render('editarLic',{
                tipos,
                publicacion,
                title : 'Editar Publicación'
            })
        })
        .catch(error => console.log(error))

    },

    update : (req,res) => {

        const errors = validationResult(req)

        if(req.fileValidationError){ //este if valida que solo se puedan subir extensiones (pdf)
            errors.errors.push({
                value : "",
                msg : req.fileValidationError,
                param : "pdf",
                location : "file"
            })
        }

        /* return res.send(errors.mapped()) */

        if(errors.isEmpty()){

            const {expediente, titulo, objetivo, tipo} = req.body

            const id = req.params.id

            db.Publicaciones.findByPk(id)
            .then(publicacion => {
                db.Publicaciones.update(
                    {
                    expediente: expediente.trim(),
                    titulo: titulo.trim(),
                    objetivo: objetivo.trim(),
                    tipoId: tipo,
                    archivo: req.file ? req.file.filename : publicacion.archivo
                    },
                    {
                        where : {id}
                    }
                )
                .then(publicacionUpdate => {

                    if(req.file){
                        fs.existsSync(`./public/images/licitaciones/${libroUpdate.archivo}`) && fs.unlinkSync(`./public/images/licitaciones/${libroUpdate.archivo}`)  
                    }
                    return res.redirect('/licitacion/publicaciones')

                })
            })
            .catch(error => console.log(error))

        } else {

            if(req.file){
                fs.existsSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
            }

            const {id} = req.params;

            const publicacion = db.Publicaciones.findByPk(id) //busco la publicación en la base
    
            const tipos =  db.Tipos.findAll() // busco los tipos para recorrerlos en el select del form
    
            Promise.all(([publicacion, tipos])) //engloba las dos promesas anteriores y las envia a la vista
            .then(([publicacion, tipos]) =>{
               /*  return res.send(tipos) */
                return res.render('editarLic',{
                    tipos,
                    publicacion,
                    title : 'Editar Publicación',
                    errors : errors.mapped(),
                    old : req.body
                })
            })
            .catch(error => console.log(error))
        



        }

    },

    remove : (req,res) => {

        db.Publicaciones.destroy({
            where : {id:req.params.id},
            force:true
        }).then(() => {
            return res.redirect('/licitacion/publicaciones')
        })
        .catch(error => console.log(error))

    }, 

    search : (req,res) => {

        const query = req.query.search;
        db.Publicaciones.findAll({
            where : {
                titulo : {
                    [Op.like] : `%${query}%`
                }
            },
            include : ['tipo']
        })
        .then(publicaciones => {
            return res.render('resultado',{
                publicaciones,
                title : 'Resultado de la busqueda'
            })
        })
        .catch(error => console.log(error))
    }
}