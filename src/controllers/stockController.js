const db = require("../database/models")
const {validationResult} = require('express-validator')
const { Op } = require('sequelize');
const { getAllStocks, getGeneralStock } = require("../services/stockServices");
const ExcelJS = require('exceljs');


module.exports = {
    list : async (req,res) => {
        const userLogin = req.session.userLogin;     
            return res.render("stock/listStock",{               
                title:"Stock de Cunas"
            })     
    },

    newProducto : (req,res) => {

    },

    storageProducto : (req,res) => {

    },

    


























 

    estadisticas: (req,res) => {

        const productos = db.Producto.findAll({
            attributes: ['id', 'nombre']
        })

        const destinos = db.destinoUsuario.findAll({
            attributes:['id', 'nombreDestino' ]
        })

        Promise.all(([productos, destinos]))
        .then(([productos, destinos]) => {
            return res.render('stock/estadistica',{
                title:'Estadisticas',
                productos,
                destinos
            })
        })
      
    },

 

 


 


 

    descargarTablaStock : async (req,res) => {      

        try {
            const datosStock = await getGeneralStock(); // Traigo mi consulta de stock
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel (CREO)
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Destino", "Nombre Producto", "Cantidad", "Actualizado el"]);
    
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
    
            datosStock.forEach(stock => {
                const row = worksheet.addRow([stock.destino.nombreDestino, stock.producto.nombre, stock.cantidad, stock.updatedAt]);
                
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-stock.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }

    },

    descargarTablaRetirosStock : async (req,res) => {
        try {
            const datosStock = await db.detalleRetiro.findAll({
                include:["destino", "producto"],
                order:[["updatedAt", "DESC"]]
            }) ; // Traigo mi consulta de stock

         /*    return res.send(datosStock) */
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel (CREO)
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Destino", "Nombre Producto", "Cantidad Retirada", "Actualizado el"]);
    
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
    
            datosStock.forEach(stock => {
                const row = worksheet.addRow([stock.destino.nombreDestino, stock.producto.nombre, stock.cantidadRetirada, stock.updatedAt]);
                
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-RetirosStock.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }
    },

    descargarTablaStockCPFII: async (req,res) => {
        try {
            const datosStock = await getAllStocks(); // Traigo mi consulta de stock
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel (CREO)
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Destino", "Nombre Producto", "Cantidad", "Actualizado el"]);
    
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
    
            datosStock.forEach(stock => {
                const row = worksheet.addRow([stock.usuario.destino.nombreDestino, stock.producto.nombre, stock.cantidad, stock.updatedAt]);
                
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-stockCPFII.xlsx"`); // agregar al nombre la fecha con New Date()
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