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
            const titleRow = worksheet.addRow(["Nombre", "Taller", "Expediente", "Procedencia", "Detalle", "Duración", "Productos", "Remanentes", "Última Actualización"]);
    
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
                // Combinar información de productos
                const productosInfo = item.productoParte.map(productoItem => {
                    return `${productoItem.producto.nombre} - A producir: ${productoItem.cantidadAProducir} - Producido: ${productoItem.cantidadProducida} - En Stock: ${productoItem.stockEnTaller} - Egresos ${productoItem.egresos}`;
                }).join(" // ");
    
                // Agregar fila con los datos combinados
                const row = worksheet.addRow([
                    item.nombre,
                    item.parteTaller.nombre,
                    item.expediente,
                    item.procedencia,
                    item.detalle,
                    `${item.duracion} ${item.unidadDuracion}`,
                    productosInfo,
                    item.remanentes,
                    item.updatedAt
                ]);
    
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
            const fileName = `${fecha.toISOString().substring(0, 10)}-parteSemanal${parte[0].nombre}.xlsx`;
    
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
            subject: 'Informe de Parte Semanal', // El asunto del correo electrónico
            text: 'Adjunto encontrará el informe del parte Semanal en formato Excel.', // El mensaje del correo electrónico
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
            return res.redirect('/stock/partes/')
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