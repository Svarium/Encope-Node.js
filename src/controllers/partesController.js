const fs = require('fs');
const {validationResult} = require('express-validator');
const path = require('path');
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');
require("dotenv").config();

const db = require('../database/models');
const transporter = require('../helpers/configNodemailer');

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

    editParte :  async (req,res) => {

        try {

         const id = req.params.id;

         const parte = await db.Parte.findOne({
             where:{
                 id:id
             },
             include: [{
                model: db.proyectoProducto,
                as:"productoParte",
                include:[
                    {
                        model: db.Producto,
                        as:"producto"
                    }
                ]
             }]
            })
     

            const productos = await db.proyectoProducto.findAll({where:{proyectoId:id}});//busco todos los productos de un proyecto

            const cantidadTotalAProducir = productos.reduce((total, producto) => { // Sumo el total a producir de todos los productos
                return total + producto.cantidadAProducir;
            }, 0); // Se inicializa con 0 para evitar problemas si la lista está vacía
      
            const cantidadTotalProducida = productos.reduce((total, producto) => { // Sumo el total producido de todos los productos
                return total + producto.cantidadProducida;
            }, 0); // Se inicializa con 0 para evitar problemas si la lista está vacía

         
            const porcentajeAvance = (cantidadTotalProducida / cantidadTotalAProducir) * 100;

            const ideal = cantidadTotalAProducir / parte.duracion;

            const real = cantidadTotalProducida / parte.duracion              
            
     
             return res.render('stock/partes/editParte',{
                 title: 'Editar parte',
                 parte,             
                 porcentajeAvance: porcentajeAvance.toFixed(2),
                 ideal,
                 real,                
             })
           
            
        } catch (error) {
            console.log(error);
        }
      
    },



    printParte : async (req,res) => {
        try {
            const id = req.params.id;
            const parte = await db.Parte.findAll({
                where: { id: id },
                include: [{
                    model: db.proyectoProducto,
                    as: 'productoParte',
                    attributes: ["cantidadAProducir", "cantidadProducida", "stockEnTaller", "egresos"],
                    include: [{
                        model: db.Producto,
                        as: 'producto',
                        attributes: ["nombre"]
                    }]
                }, {
                    model: db.Taller,
                    as: 'parteTaller',
                    attributes: ["nombre"]
                }],
            });
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet 1');
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos","Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos" ,"Remanentes", "Última Actualización"]);
    
            // Aplicar formato al título
            titleRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' }
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });
    
            parte.forEach(item => {
                item.productoParte.forEach(productoItem => {
                    const row = worksheet.addRow([
                        item.nombre,
                        item.parteTaller.nombre,
                        item.expediente,
                        item.procedencia,
                        item.detalle,
                        `${item.duracion} ${item.unidadDuracion}`,
                        productoItem.producto.nombre,
                        productoItem.cantidadAProducir,
                        productoItem.cantidadProducida,
                        productoItem.stockEnTaller,
                        productoItem.egresos,
                        item.remanentes,
                        item.updatedAt
                    ]);
            
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });
            });
            
    
            const fecha = new Date(Date.now());
            const fileName = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
    
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.log(error);
        }
    },

    printParteInsumos : async (req,res) => {

        try {
            const id = req.params.id;
    
            const parteInsumos = await db.Parte.findOne({
                where: { id: id },
                attributes: ["nombre", "procedencia", "updatedAt"],
                include: [{
                    model: db.proyectoProducto,
                    as: 'productoParte',
                    attributes: ["cantidadAProducir", "cantidadProducida"],
                    include: [{
                        model: db.Producto,
                        as: 'producto',
                        attributes: ["nombre", "id"],
                        include: [{
                            model: db.Insumo,
                            as: "productos",
                            attributes: ["nombre", "cantidad"]
                        }]
                    }]
                }, {
                    model: db.Taller,
                    as: 'parteTaller',
                    attributes: ["nombre"]
                }],
            });
    
            const workbook = new ExcelJS.Workbook();
            const worksheet = workbook.addWorksheet('Sheet 1');
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre del Proyecto", "Procedencia" ,"Taller", "Producto/s", "Cantidad de Insumos al Inicio", "Cantidad de Insumos Actual", "Última actualización"]);
    
            // Aplicar formato al título
            titleRow.eachCell((cell) => {
                cell.font = { bold: true };
                cell.fill = {
                    type: 'pattern',
                    pattern: 'solid',
                    fgColor: { argb: 'FFFF00' }
                };
                cell.border = {
                    top: { style: 'thin' },
                    left: { style: 'thin' },
                    bottom: { style: 'thin' },
                    right: { style: 'thin' }
                };
            });

           
    
            if (parteInsumos) {
                parteInsumos.productoParte.forEach(productoItem => {
                    productoItem.producto.productos.forEach(insumoItem => {
                        const cantidadInicial = productoItem.cantidadAProducir * insumoItem.cantidad;
                        const cantidadActual = productoItem.cantidadProducida * insumoItem.cantidad;
    
                        worksheet.addRow([
                            parteInsumos.nombre,
                            parteInsumos.procedencia,
                            parteInsumos.parteTaller.nombre,
                            productoItem.producto.nombre,
                            `${insumoItem.nombre}: ${cantidadInicial}`,
                            `${insumoItem.nombre}: ${cantidadActual}`,
                            parteInsumos.updatedAt
                        ]).eachCell((cell) => {
                            cell.border = {
                                top: { style: 'thin' },
                                left: { style: 'thin' },
                                bottom: { style: 'thin' },
                                right: { style: 'thin' }
                            };
                        });
                    });
                });
            }
    
            const fecha = new Date(Date.now());
            const fileName = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos.nombre}.xlsx`;
    
            res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            await workbook.xlsx.write(res);
            res.end();
        } catch (error) {
            console.log(error);
        }

    },

    reporteViaEmail : async (req,res) => {

        try {
            const id = req.params.id;
      
            const parte = await db.Parte.findAll({
              where: { id: id },
              include: [{
                model: db.proyectoProducto,
                as: 'productoParte',
                attributes: ["cantidadAProducir", "cantidadProducida", "stockEnTaller", "egresos"],
                include: [{
                  model: db.Producto,
                  as: 'producto',
                  attributes: ["nombre"]
                }]
              }, {
                model: db.Taller,
                as: 'parteTaller',
                attributes: ["nombre"]
              }],
            });
      
            const parteInsumos = await db.Parte.findOne({
              where: { id: id },
              attributes: ["nombre", "procedencia", "updatedAt"],
              include: [{
                model: db.proyectoProducto,
                as: 'productoParte',
                attributes: ["cantidadAProducir", "cantidadProducida"],
                include: [{
                  model: db.Producto,
                  as: 'producto',
                  attributes: ["nombre", "id"],
                  include: [{
                    model: db.Insumo,
                    as: "productos",
                    attributes: ["nombre", "cantidad"]
                  }]
                }]
              }, {
                model: db.Taller,
                as: 'parteTaller',
                attributes: ["nombre"]
              }],
            });
      
            // Generar el primer archivo Excel
            const fecha = new Date(Date.now());
            const fileName1 = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
            const filePath1 = path.join(__dirname, '../../temp/', fileName1);
      
            const workbook1 = new ExcelJS.Workbook();
            const worksheet1 = workbook1.addWorksheet('Sheet 1');
      
            const titleRow1 = worksheet1.addRow(["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos","Cantidad a producir", "Cantidad Producida", "Stock en Taller", "egresos" ,"Remanentes", "Última Actualización"]);
            titleRow1.eachCell((cell) => {
              cell.font = { bold: true };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
      
            parte.forEach(item => {
                item.productoParte.forEach(productoItem => {
                    const row = worksheet1.addRow([
                        item.nombre,
                        item.parteTaller.nombre,
                        item.expediente,
                        item.procedencia,
                        item.detalle,
                        `${item.duracion} ${item.unidadDuracion}`,
                        productoItem.producto.nombre,
                        productoItem.cantidadAProducir,
                        productoItem.cantidadProducida,
                        productoItem.stockEnTaller,
                        productoItem.egresos,
                        item.remanentes,
                        item.updatedAt
                    ]);
            
                    row.eachCell((cell) => {
                        cell.border = {
                            top: { style: 'thin' },
                            left: { style: 'thin' },
                            bottom: { style: 'thin' },
                            right: { style: 'thin' }
                        };
                    });
                });
            });
            
            await workbook1.xlsx.writeFile(filePath1);
      
            // Generar el segundo archivo Excel
            const fileName2 = `${fecha.toISOString().substring(0, 10)}-parteInsumos${parteInsumos.nombre}.xlsx`;
            const filePath2 = path.join(__dirname, '../../temp/', fileName2);
      
            const workbook2 = new ExcelJS.Workbook();
            const worksheet2 = workbook2.addWorksheet('Sheet 1');
      
            const titleRow2 = worksheet2.addRow(["Nombre del Proyecto", "Procedencia" ,"Taller", "Producto/s", "Cantidad de Insumos al Inicio", "Cantidad de Insumos Actual", "Última actualización"]);
            titleRow2.eachCell((cell) => {
              cell.font = { bold: true };
              cell.fill = {
                type: 'pattern',
                pattern: 'solid',
                fgColor: { argb: 'FFFF00' }
              };
              cell.border = {
                top: { style: 'thin' },
                left: { style: 'thin' },
                bottom: { style: 'thin' },
                right: { style: 'thin' }
              };
            });
      
            if (parteInsumos) {
              parteInsumos.productoParte.forEach(productoItem => {
                productoItem.producto.productos.forEach(insumoItem => {
                  const cantidadInicial = productoItem.cantidadAProducir * insumoItem.cantidad;
                  const cantidadActual = productoItem.cantidadProducida * insumoItem.cantidad;
      
                  worksheet2.addRow([
                    parteInsumos.nombre,
                    parteInsumos.procedencia,
                    parteInsumos.parteTaller.nombre,
                    productoItem.producto.nombre,
                    `${insumoItem.nombre}: ${cantidadInicial}`,
                    `${insumoItem.nombre}: ${cantidadActual}`,
                    parteInsumos.updatedAt
                  ]).eachCell((cell) => {
                    cell.border = {
                      top: { style: 'thin' },
                      left: { style: 'thin' },
                      bottom: { style: 'thin' },
                      right: { style: 'thin' }
                    };
                  });
                });
              });
            }
      
            await workbook2.xlsx.writeFile(filePath2);
      
            // Una vez que ambos archivos se hayan generado y guardado en el servidor, puedes adjuntarlos al correo electrónico
            const mailOptions = {
              from: process.env.EMAIL_USER,
              to: 'informatica@encope.gob.ar',
              subject: 'Informe de Parte Semanal',
              text: 'Adjunto encontrará el informe del parte Semanal de stock y de insumos ambos en formato Excel.',
              attachments: [
                {
                  filename: fileName1,
                  path: filePath1
                },
                {
                  filename: fileName2,
                  path: filePath2
                }
              ]
            };
      
            await transporter.sendMail(mailOptions);
            console.log('Correo electrónico enviado correctamente');
      
            fs.unlink(filePath1, (err) => {
              if (err) {
                console.error('Error al borrar el archivo Excel 1:', err);
                return res.status(500).send('Error al borrar el archivo Excel 1');
              }
              console.log('Archivo Excel 1 borrado correctamente');
            });
      
            fs.unlink(filePath2, (err) => {
              if (err) {
                console.error('Error al borrar el archivo Excel 2:', err);
                return res.status(500).send('Error al borrar el archivo Excel 2');
              }
              console.log('Archivo Excel 2 borrado correctamente');
              return res.redirect('/stock/partes/');
            });

        
        } catch (error) {
            console.log(error);
        
        }

    },

    reporteAutomaticoViaEmail : async (req,res) =>{
        try {
            
         
            const parte = await db.Parte.findAll({               
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

         // Generar el archivo Excel 
        const fecha = new Date(Date.now());        
        const fileName = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
        const filePath = __dirname + '/../../temp/' + fileName;
           
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
    
                 
           // Guardar el archivo Excel en el servidor
           await workbook.xlsx.writeFile(filePath);
    
        // Una vez que el archivo se haya generado y guardado en el servidor, puedes adjuntarlo al correo electrónico
        const mailOptions = {
            from: process.env.EMAIL_USER, // Tu dirección de correo electrónico
            to: 'informatica@encope.gob.ar', // El destinatario del correo electrónico
            subject: 'Informe de Partes Semanales', // El asunto del correo electrónico
            text: 'Adjunto encontrará un excel con un reporte de todos los partes semanales vigentes', // El mensaje del correo electrónico
            attachments: [
                {
                    filename: fileName, // El nombre del archivo adjunto
                    path: filePath // La ruta del archivo adjunto
                }
            ]
        };

        // Enviar el correo electrónico
        await transporter.sendMail(mailOptions);
        console.log('Correo electrónico enviado correctamente');

        fs.unlink(filePath, (err) => {
            if (err) {
                console.error('Error al borrar el archivo Excel:', err);
                // Puedes manejar el error de acuerdo a tus necesidades, por ejemplo, enviando una respuesta de error al cliente
                return res.status(500).send('Error al borrar el archivo Excel');
            }
            console.log('Archivo Excel borrado correctamente');
            // Puedes enviar una respuesta exitosa al cliente si lo deseas
            if (res) {
                return res.status(200).end();
            } else {
                console.log('No hay objeto de respuesta definido');
            }
        });

        
        } catch (error) {
            console.log(error);
        
        }
    }


}