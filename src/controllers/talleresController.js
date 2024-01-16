const db = require('../database/models');
const {validationResult} = require('express-validator');
const {op} = require('sequelize');
const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');


module.exports = {

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
               return res.redirect('/stock')
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
    


}