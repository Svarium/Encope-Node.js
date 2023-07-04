const { validationResult } = require("express-validator");
const db = require("../database/models")
const fs = require("fs");

module.exports = {

    //listar las noticias para mostrar en el carrusel del home
    listHome: (req,res) => {

    },

    //renderiza la vista del detalle de la noticia
    detail : (req,res) => {

    },


    //renderiza la vista para el formulario de agregar noticia
    add:(req,res) => {
        return res.render("noticias/addNoticia",{
            title: "Agrega noticia"
        })
    },

    //guarda la noticia en la base de datos
    store:(req,res) => {
        const errors = validationResult(req);
        if (!req.files.length && !req.fileValidationError) {
            errors.errors.push({
              value: "",
              msg: "La noticia debe tener por lo menos una imagen",
              param: "images",
              location: "files",
            });
          }
      
          if (req.fileValidationError) {
            errors.errors.push({
              value: "",
              msg: req.fileValidationError,
              param: "images",
              location: "files",
            });
          }

           return res.send(errors.mapped())


    },

    //Renderiza el formulario de edicion para la noticia
    edit:(req,res)=>{

    },

    //edita la noticia en la base de datos
    update:(req,res)=>{

    },
    
    //elimina la noticia de la base de datos
    remove:(req,res) => {

    }









}

