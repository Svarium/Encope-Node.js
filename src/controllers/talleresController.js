const db = require('../database/models');
const {validationResult} = require('express-validator');
const {op} = require('sequelize');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');
const { error } = require('console');


module.exports = {


    listTaller : (req,res) => {
        db.Taller.findAll({
            include: ['destinoTaller']
        })
        .then(talleres => {           
            return res.render("stock/talleres/listTaller",{
                title: "Lista de Talleres",
                talleres
            })
        }).catch(error => console.log(error));
    },

    newTaller : (req,res) => {
        db.destinoUsuario.findAll({
            attributes:{
                exclude:["ciudad", "createdAt", "updatedAt", "provincia"]
            }
        })
        .then(destinos => {
            return res.render('stock/talleres/addTaller',{
                title:'Nuevo taller',
                destinos
            })
        })
        .catch(errors => console.log(errors));    
    },


    storageTaller : (req,res) => {
        const errors = validationResult(req);


        if (errors.isEmpty()) {
            
            const {nombre, destino, detalle, expediente} = req.body

            db.Taller.create({
                nombre:nombre.trim(),
                idDestino:destino,
                detalle:detalle.trim(),
                expediente:expediente,
            })
            .then(() => {
               return res.redirect('/stock/talleresTable')
            }).catch(errors => console.log(errors))

        } else {
            db.destinoUsuario.findAll({
                attributes:{
                    exclude:["ciudad", "createdAt", "updatedAt", "provincia"]
                }
            })
            .then(destinos => {
                return res.render('stock/talleres/addTaller',{
                    title:'Nuevo taller',
                    destinos,
                    errors:errors.mapped(),
                    old:req.body
                })
            })
            .catch(errors => console.log(errors));          
        }
    },

    editTaller:(req,res) => {
        
         const id = req.params.id
         const taller = db.Taller.findByPk(id)
         const destinos =  db.destinoUsuario.findAll()
         
         Promise.all(([taller,destinos]))
         .then(([taller, destinos]) => {
            return res.render('stock/talleres/editTaller',{
                title:"Editar Taller",
                taller,
                destinos
            })
         }).catch(errors => console.log(errors));     
           
    },

    updateTaller: (req,res) => {

        const errors = validationResult(req);
        const id = req.params.id;
        const {nombre, destino, detalle, expediente } = req.body
        
        if(errors.isEmpty()) {

            db.Taller.update({
                nombre: nombre.trim(),
                idDestino: destino,
                detalle:detalle.trim(),
                expediente:expediente
            },{
                where:{id:id}
            }).then(() => {
                return res.redirect('/stock/talleresTable')
            }).catch(errors => console.log(errors))

        } else {
            const id = req.params.id
            const taller = db.Taller.findByPk(id)
            const destinos =  db.destinoUsuario.findAll()
            
            Promise.all(([taller,destinos]))
            .then(([taller, destinos]) => {
               return res.render('stock/talleres/editTaller',{
                   title:"Editar Taller",
                   taller,
                   destinos,
                   old:req.body,
                   errors:errors.mapped()
               })
            }).catch(errors => console.log(errors));    
        }
    }
}