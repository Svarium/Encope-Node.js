const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const bcrypt = require('bcrypt')
const { Op } = require("sequelize");

const db = require("../database/models")


module.exports = {

    list : (req,res) => {   
      const userLogin = req.session.userLogin     
        return res.render('licitaciones',{
            title: 'Licitaciones',
            userLogin
         
        }) 
    },

    verTodas : (req,res) => {     
      const userLogin = req.session.userLogin
            return res.render('adminLicitaciones',{
                title: 'Administrar Licitaciones',  
                userLogin            
            })      
    },


    agregar : (req,res) => {
      const userLogin = req.session.userLogin
        db.Tipos.findAll({
            attributes:{exclude:['createdAt','updatedAt']},
            order : [['nombre']],
        })
        .then(tipos =>{

            return res.render('agregarLic',{
                title: 'Nueva Publicación',
                tipos,
                userLogin
            })
        })
        .catch(error => console.log(error))
    },

    store : (req,res) => {

        const errors = validationResult(req)

      const userLogin = req.session.userLogin

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
                old : req.body,
                userLogin
            })
        })
        .catch(error => console.log(error))
    }


    },

    edit : (req,res) => {

      const userLogin = req.session.userLogin

        const {id} = req.params;

        const publicacion = db.Publicaciones.findByPk(id) //busco la publicación en la base

        const tipos =  db.Tipos.findAll({
            attributes:{exclude:['createdAt','updatedAt']},
        }) // busco los tipos para recorrerlos en el select del form

        Promise.all(([publicacion, tipos])) //engloba las dos promesas anteriores y las envia a la vista
        .then(([publicacion, tipos]) =>{
           /*  return res.send(tipos) */
            return res.render('editarLic',{
                tipos,
                publicacion,
                title : 'Editar Publicación',
                userLogin
            })
        })
        .catch(error => console.log(error))

    },

    update: async (req, res) => {
        try {
            const userLogin = req.session.userLogin;
            const errors = validationResult(req);
    
            if (req.fileValidationError) {
                errors.errors.push({
                    value: "",
                    msg: req.fileValidationError,
                    param: "pdf",
                    location: "file"
                });
            }
    
            if (errors.isEmpty()) {
                const { expediente, titulo, objetivo, tipo } = req.body;
                const id = req.params.id;
    
                if (req.file) {
                    // Eliminar el archivo anterior solo si se subió uno nuevo
                    const publicacion = await db.Publicaciones.findByPk(id);
                    const filePath = `./public/images/licitaciones/${publicacion.archivo}`;
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
    
                const publicacion = await db.Publicaciones.findByPk(id);
                publicacion.expediente = expediente.trim();
                publicacion.titulo = titulo.trim();
                publicacion.objetivo = objetivo.trim();
                publicacion.tipoId = tipo;
                publicacion.archivo = req.file ? req.file.filename : publicacion.archivo;
    
                await publicacion.save();
                return res.redirect('/licitacion/publicaciones');

            } else {
                if(req.file){
                    fs.existsSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/licitaciones/${req.file.filename}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
                }
    
                const {id} = req.params;
    
                const publicacion = db.Publicaciones.findByPk(id) //busco la publicación en la base
        
                const tipos =  db.Tipos.findAll({
                    attributes:{exclude:['createdAt','updatedAt']},
                }) // busco los tipos para recorrerlos en el select del form
        
                Promise.all(([publicacion, tipos])) //engloba las dos promesas anteriores y las envia a la vista
                .then(([publicacion, tipos]) =>{
                   /*  return res.send(tipos) */
                    return res.render('editarLic',{
                        tipos,
                        publicacion,
                        title : 'Editar Publicación',
                        errors : errors.mapped(),
                        old : req.body,
                        userLogin
                    })
                })
                .catch(error => console.log(error))
            }    

            
        } catch (error) {
            console.log(error);
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
      const userLogin = req.session.userLogin

        const query = req.query.search;
        db.Publicaciones.findAll({
            where : {
                titulo : {
                    [Op.like] : `%${query}%`
                }
            },
            include : ['tipo'],
            attributes:{exclude:['createdAt','updatedAt']},
        })
        .then(publicaciones => {
            return res.render('resultado',{
                publicaciones,
                title : 'Resultado de la busqueda',
                userLogin
            })
        })
        .catch(error => console.log(error))
    },

    searchLicitacion : (req,res) => {
        const userLogin = req.session.userLogin

        const querySearch = req.query.search;
        db.Publicaciones.findAll({
            where : {
                titulo : {
                    [Op.like] : `%${querySearch}%`
                }
            },
            include : ['tipo'],
            attributes:{exclude:['createdAt','updatedAt']},

        })
        .then(publicaciones => {
            return res.render('searchLicitacion',{
                publicaciones,
                title : 'Resultado de la busqueda',
                userLogin
            })
        })
        .catch(error => console.log(error))
    }


}