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


    printParte : async (req,res) => {
        try {
            
            const id = req.params.id
            const parte = await db.Parte.findAll({
                where:{
                    id:id
                },
                include:[{
                    model: db.Producto,
                    as:'parteProducto', 
                    attributes:["nombre"]
                },
                {
                    model: db.Taller,
                    as:'parteTaller', 
                    attributes:["nombre"]
                }
            ],
            
            });

           /*  return res.send(parte) */
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre", "Taller","Producto", "Expediente", "Procedencia", "Detalle", 'Duración', 'Cantidad a Producir', "Cantidad Producida", "stockEnTaller", 'Egresos', "Remanentes", "Ultima Actualización"]);
    
            // Aplicar formato al título
            titleRow.eachCell((cell) => {
                cell.font = { bold: true }; // Establece el texto en negrita
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' } // Cambia el color de fondo a amarillo (puedes cambiar 'FFFF00' por el código del color que prefieras)
                };
    
                // Agregar bordes
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
    
            parte.forEach(item => {
                const row = worksheet.addRow([item.nombre, item.parteTaller.nombre, item.parteProducto.nombre, item.expediente, item.procedencia, item.detalle, item.duracion + item.unidadDuracion, item.cantidadAProducir, item.cantidadProducida, item.stockEnTaller, item.egresos, item.remanentes, item.updatedAt]);
                
                // Aplicar bordes a las celdas de la fila de datos
                row.eachCell((cell) => {
                    cell.border = {
                        top: { style: 'thin' },
                        left: { style: 'thin' },
                        bottom: { style: 'thin' },
                        right: { style: 'thin' }
                    };
                });
            });
    
            const fecha = new Date(Date.now());
    
            // Define el nombre del archivo Excel
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-tablaDeProyectosProductivos.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }
    }
}