const fs = require('fs');
const {validationResult} = require('express-validator');
const path = require('path');
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');
require("dotenv").config();

const db = require('../database/models');
const { error } = require('console');

module.exports = {

    listFichas: (req,res) => {
        db.Ficha.findAll()
        .then(fichas => {
            return res.render('stock/fichas/fichas', {
                title: "Fichas Técnicas",
                fichas
            })
        }).catch(error => console.log(error))
    },

    addFicha: (req,res) => {

        return res.render('stock/fichas/addFicha',{
            title: "Agregar Ficha Técnica"
        })

    },

    storeFicha: (req,res) => {
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

           // Manejar el error si el archivo excede el tamaño máximo (nuevo)
    if (req.fileSizeError) {
        errors.errors.push({
            value: "",
            msg: req.fileSizeError,
            param: "ficha",
            location: "file"
        });
    }      
        
        if(errors.isEmpty()){     

        const {nombre, expediente} = req.body  

        db.Ficha.create({
            expediente:expediente.trim(),
            nombre:nombre.trim(),
            archivo: req.file? req.file.filename : null
        }).then(ficha => {
            return res.redirect('/stock/listFichas')
        }).catch(errors => console.log(errors))    



        } else {

            if(req.file){
                fs.existsSync(path.join(__dirname,`../../public/images/fichasTecnicas/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/fichasTecnicas/${req.file.filename}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
            }

            return res.render('stock/fichas/addFicha',{
                title: "Agregar Ficha Técnica",
                old: req.body,
                errors: errors.mapped()
            })
    
        }
    },

    editFicha: (req,res) => {
        const id = req.params.id;

        db.Ficha.findOne({where:{id}})
        .then(ficha => {
            return res.render('stock/fichas/editFicha',{
                title:"Editar Ficha",
                ficha
            })
        }).catch(error => console.log(error))

    },

    updateFicha: (req,res) => {
            
            const errors = validationResult(req);

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
    
               // Manejar el error si el archivo excede el tamaño máximo (nuevo)
        if (req.fileSizeError) {
            errors.errors.push({
                value: "",
                msg: req.fileSizeError,
                param: "ficha",
                location: "file"
            });
        }      

        if (errors.isEmpty()){

        const id = req.params.id;
        const {nombre, expediente} = req.body;
        
        let oldFile;

        db.Ficha.findByPk(id)
        .then(ficha => {
            oldFile = ficha.archivo;

            return ficha.update({
                nombre:nombre.trim(),
                expediente:expediente.trim(),
                archivo: req.file ? req.file.filename : ficha.archivo
            });
        })
        .then(() => {
            if(req.file){
                fs.existsSync(path.join(__dirname, `../../public/images/fichasTecnicas/${oldFile}`)) && fs.unlinkSync(path.join(__dirname, `../../public/images/fichasTecnicas/${oldFile}`))
            }

            return res.redirect('/stock/listFichas')
        }).catch(error => console.log(error))    


        } else {

            const id = req.params.id;

            if(req.file){
                fs.existsSync(path.join(__dirname,`../../public/images/fichasTecnicas/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname,`../../public/images/fichasTecnicas/${req.file.filename}`)) //SI HAY ERROR Y CARGÓ IMAGEN ESTE METODO LA BORRA
            }

            db.Ficha.findOne({where:{id}})
            .then(ficha => {
                return res.render('stock/fichas/editFicha',{
                    title:"Editar Ficha",
                    ficha,
                    old: req.body,
                    errors: errors.mapped()
                })
            }).catch(error => console.log(error))

        }
    },

    deleteFicha: (req,res) => {
        const id = req.params.id

        db.Ficha.destroy({where:{id:id}})
        .then(() => {
            return res.redirect('/stock/listFichas')
        }).catch(error => console.log(error))
    }

}