const fs = require('fs');
const {validationResult} = require('express-validator');
const {hashSync} = require('bcryptjs');
const bcrypt = require('bcrypt')
const path = require('path');
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');

const db = require('../database/models');
const { error } = require('console');

module.exports = {

    listProyects : (req, res) => {

        db.Proyecto.findAll()
        .then(proyectos => {
            return res.render('stock/proyectos/proyectos',{
                title:'Proyectos Productivos',
                proyectos
            }) 
        }).catch(error => console.log(error))

       
    },

    addNewProyect : (req,res) => {

        const talleres = db.Taller.findAll({
            attributes : ['id', 'nombre'],
            include:[{
                model: db.destinoUsuario,
                as:'destinoTaller',
                attributes:['id', 'nombreDestino']
            }],
        })
        const productos = db.Producto.findAll({
            attributes : ['id', 'nombre'],
        })
        
        const fichas = db.Ficha.findAll({
            attributes : ['id', 'nombre']
        })

        Promise.all(([talleres,productos, fichas]))
        .then(([talleres,productos, fichas]) =>{        
      
            return res.render('stock/proyectos/addproyect',{
                title:'Nuevo Proyecto',
                talleres,
                productos,
                fichas
            })
        }).catch(error => console.log(error));     
    },

    storeProyect : (req,res) => {                  
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


       if(errors.isEmpty()){
        res.send(req.body)
       }else{
        res.send(errors.mapped())
       }
      
    },

    editProyect: (req,res) => {     

        const id = req.params.id

        const talleres = db.Taller.findAll({
            attributes : ['id', 'nombre'],
            include:[{
                model: db.destinoUsuario,
                as:'destinoTaller',
                attributes:['id', 'nombreDestino']
            }],
        })
        const productos = db.Producto.findAll({
            attributes : ['id', 'nombre'],
        })

        const proyecto =  db.Proyecto.findOne({
            where:{id:id}
        })

        
        Promise.all(([talleres,productos, proyecto]))
        .then(([talleres,productos, proyecto]) =>{        
      
            return res.render('stock/proyectos/editProyect',{
                title:'Nuevo Proyecto',
                talleres,
                productos,
                proyecto
            })
        }).catch(error => console.log(error));      
     
    },

    updateProyect: async (req,res) => {

        try {

        const errors = validationResult(req);

        const id = req.params.id

        const {nombre, expediente, destino, producto, cantidad, insumos, detalle, duracion, unidadDuracion, costoUnitario} = req.body

        const usuario = await db.Usuario.findOne({ //busco el usuario para poder acceder al destino de procedencia y cargarlo despues en los registros
            where: {destinoId : req.session.userLogin.destinoId},
            attributes:[],
            include:[{
                model: db.destinoUsuario,
                as:"destino",
                attributes: ["nombreDestino"]
            }]
        })

        const procedencia = usuario.destino.nombreDestino


       if(errors.isEmpty()){

        const proyectoAnterior = await db.Proyecto.findOne({where:{id:id}}) //busco el proyecto en su version vigente antes de ser editado

        await db.Historial.create({  //creo el registro donde guardo la version del proyecto vigente
            nombre:proyectoAnterior.nombre,
            expediente:proyectoAnterior.expediente,
            idTaller: proyectoAnterior.idTaller,
            cantidadAProducir: proyectoAnterior.cantidadAProducir,
            detalle: proyectoAnterior.detalle,
            insumos: proyectoAnterior.insumos,
            procedencia: proyectoAnterior.procedencia,
            duracion: proyectoAnterior.duracion,
            unidadDuracion: proyectoAnterior.unidadDuracion,
            costoTotal: proyectoAnterior.costoTotal,
            costoUnitario: proyectoAnterior.costoUnitario,
            idProducto: proyectoAnterior.idTaller,
            idProyecto: id,           
            estado: 'Pendiente'
        })

        await db.Proyecto.update({ //actualizo el proyecto con los nuevos datos enviados por el usuario
            nombre:nombre.trim(),
            expediente:expediente,
            idTaller: destino,
            cantidadAProducir: cantidad,
            insumos:insumos,
            detalle:detalle,
            procedencia: procedencia,
            duracion: duracion,
            unidadDuracion: unidadDuracion,
            costoTotal: cantidad * costoUnitario,
            costoUnitario:costoUnitario,
            idProducto: producto,
            estado: 'Pendiente'
        },
        {
            where:{
                id:req.params.id
            }
        })

        await db.Parte.update({ //actualizo el parte semanal con los datos actualizados del proyecto
            nombre:nombre.trim(),
            expediente:expediente,
            idTaller: destino,
            cantidadAProducir: cantidad,
            detalle:detalle,
            procedencia: procedencia,
            duracion: duracion,
            unidadDuracion: unidadDuracion,
            costoTotal: cantidad * costoUnitario,
            costoUnitario:costoUnitario,
            idProducto: producto,      
        },{
            where:{
                id:req.params.id
            }
        })

        return res.redirect('/stock/listProyects')

       } else {
        const id = req.params.id

        const talleres = db.Taller.findAll({
            attributes : ['id', 'nombre'],
            include:[{
                model: db.destinoUsuario,
                as:'destinoTaller',
                attributes:['id', 'nombreDestino']
            }],
        })
        const productos = db.Producto.findAll({
            attributes : ['id', 'nombre'],
        })

        const proyecto =  db.Proyecto.findOne({
            where:{id:id}
        })

        Promise.all(([talleres,productos, proyecto]))
        .then(([talleres,productos, proyecto]) =>{        
      
            return res.render('stock/proyectos/editProyect',{
                title:'Nuevo Proyecto',
                talleres,
                productos,
                proyecto,
                old:req.body,
                errors: errors.mapped()
            })
        }).catch(error => console.log(error));  
       }

        } catch (error) {
            console.log(error);
        }

        
    },

    deleteProyect: async (req,res) => {
        

      try {
        const id = req.params.id

        const destroyhistorial = await db.Historial.destroy({where:{idProyecto:id}})

        const destroyParte = await db.Parte.destroy({where:{idProyecto:id}})
        
        const destroyProyecto = await db.Proyecto.destroy({where:{id:id}})
      

        return res.redirect('/stock/listProyects')
        
      } catch (error) {
        console.log(error);
      }
    },

    downloadExcelHistorial: async (req,res) => {
        
        try {
            const id = req.params.id
            const tablaHistorial = await db.Historial.findAll({where:{idProyecto:id}}); // Traigo mi consulta de stock
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Proyecto", "Estado" , "Detalle", "Expediente", "Procedencia", 'Duración', "Insumos" ,'Cantidad a Producir', 'Costo Unitario', 'Costo total', 'fecha de edición del proyecto']);
    
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
    
            tablaHistorial.forEach(historial => {
                const row = worksheet.addRow([historial.nombre, historial.estado, historial.detalle, historial.expediente, historial.procedencia, `${historial.duracion} - ${historial.unidadDuracion}`,historial.insumos, historial.cantidadAProducir, historial.costoUnitario, historial.costoTotal, historial.createdAt]);
                
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-historialReformulaciónes.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }

    },

    downloadExcelProyects: async (req,res) => {
        
        try {
 
            const tablaProyects = await db.Proyecto.findAll(); // Traigo mi consulta
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Proyecto", "Estado" ,"Detalle", "Expediente", "Procedencia", 'Duración',"Insumos", 'Cantidad a Producir', 'Costo Unitario', 'Costo total', 'fecha de creación del proyecto']);
    
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
    
            tablaProyects.forEach(proyecto => {
                const row = worksheet.addRow([proyecto.nombre, proyecto.estado ,proyecto.detalle, proyecto.expediente, proyecto.procedencia, `${proyecto.duracion} - ${proyecto.unidadDuracion}`, proyecto.insumos, proyecto.cantidadAProducir, proyecto.costoUnitario, proyecto.costoTotal, proyecto.createdAt]);
                
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

    },

    searchProyect: (req,res) => {

            const query = req.query.search;

            db.Proyecto.findOne({
                where: {
                    expediente :{
                        [Op.like] : `%${query}%`
                    }
                },              
            }).then( proyecto => {

                db.Parte.findOne({
                    where:{
                        idProyecto:proyecto.id
                    }
                }) .then( parte => {
                    const cantidad = parte.cantidadProducida

                    const meta = parte.cantidadAProducir
    
                    const periodo = parte.duracion 
    
                    const produccionIdeal = meta / periodo
    
                    const produccionReal = cantidad / periodo
    
                    const avance = (cantidad * 100) / meta
                
                    return res.render('stock/proyectos/searchProyect',{
                        title: 'Resultado de la busqueda',
                        proyecto,
                        cantidad,
                        meta,
                        periodo,
                        produccionIdeal,
                        produccionReal,
                        avance,
                        parte
                    })
                })               

            }).catch (error => console.log(error))

    }

}