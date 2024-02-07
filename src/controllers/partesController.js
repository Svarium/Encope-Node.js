const fs = require('fs');
const {validationResult} = require('express-validator');
const path = require('path');
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');

const db = require('../database/models');
const { error } = require('console');
const { title } = require('process');

module.exports = {
    listPartes : async (req,res) => {

        try {
            const destinoId = req.session.userLogin.destinoId;

            const  procedencia = await db.destinoUsuario.findOne({
                where:{
                    id: destinoId
                }
            })

            const proyectos = await db.Proyecto.findAll({
                where:{
                    procedencia: procedencia.nombreDestino
                }
            })

            return res.render('stock/partes/partes',{
                title: 'Proyectos Productivos',
                proyectos,
                procedencia
            })

            
        } catch (error) {
            console.log(error);
        }  

    },

    editParte : (req,res) => {
       const id = req.params.id;

       db.Parte.findOne({
        where:{
            id:id
        }
       }).then(parte => {

        const cantidad = parte.cantidadProducida

        const meta = parte.cantidadAProducir

        const periodo = parte.duracion 

        const produccionIdeal = meta / periodo

        const produccionReal = cantidad / periodo

        const avance = (cantidad * 100) / meta

        return res.render('stock/partes/editParte',{
            title: 'Editar parte',
            parte,
            cantidad,
            meta,
            periodo,
            produccionIdeal,
            produccionReal,
            avance 
        })
       }).catch(error => console.log(error))
    },

    updateParte : (req,res) => {

        const errors = validationResult(req);
        const id = req.params.id;

        if (errors.isEmpty()){

         const  {cantidad, egresos, observaciones} = req.body   

         db.Parte.findOne({
            where:{
                id:id
            }
         }).then(parte => {
            db.Parte.update({
                cantidadProducida: parseInt(parte.cantidadProducida) + parseInt(cantidad),
                egresos: parseInt(parte.egresos) + parseInt(egresos),
                observaciones: observaciones ?  observaciones.trim() : parte.observaciones,
                restanteAProducir: parseInt(parte.cantidadAProducir) - parseInt(cantidad) - parseInt(parte.cantidadProducida),
                stockEnTaller: egresos?  (parseInt(cantidad) + parseInt(parte.cantidadProducida)) - (parseInt(parte.egresos) + parseInt(egresos)) :parseInt(cantidad) + parseInt(parte.cantidadProducida),
             },{
                where:{
                    id:id
                }
         })        
         }).then( parte => {
            return res.redirect('/stock/partes/'+id)
         }).catch(error => console.log(error))


        } else {          

            db.Parte.findOne({
             where:{
                 id:id
             }
            }).then(parte => {

                const cantidad = parte.cantidadProducida

                const meta = parte.cantidadAProducir
        
                const periodo = parte.duracion 
        
                const produccionIdeal = meta / periodo
        
                const produccionReal = cantidad / periodo
        
                const avance = (cantidad * 100) / meta

             return res.render('stock/partes/editParte',{
                 title: 'Editar parte',
                 parte,
                 old:req.body,
                 errors:errors.mapped(),
                 cantidad,
                 meta,
                 periodo,
                 produccionIdeal,
                 produccionReal,
                 avance 
             })
            }).catch(error => console.log(error))
        }
        
    },
}