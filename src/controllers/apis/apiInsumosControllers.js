const { validationResult } = require('express-validator');
const createResponseError = require('../../helpers/createResponseError');
const { addProyectoInsumos, addCantidadAdquirida, addNumeroFactura, addDetalleInsumo, getRemanentes } = require('../../services/insumosService');
const ExcelJS = require('exceljs');
const fs = require('fs');


module.exports = {
    createRegister : async (req,res) => {

        try {

            const proyectoId = req.body.proyectoId
            const insumos = await addProyectoInsumos(proyectoId)

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Registros creados correctamente'
                }
            })
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }

    },

    createCantidadAdquirida : async (req,res) => {

        try {

            const errors = validationResult(req);

            if(!errors.isEmpty()) throw{
                status:400,
                message:errors.mapped()
            }

            const idInsumo = req.params.id;
            const {cantidadAdquirida, idProyecto} = req.body
            const insumoProyecto = await addCantidadAdquirida(idInsumo, cantidadAdquirida, idProyecto);

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Cantidad Adquirida actualizada correctamente!',
                    cantidad: cantidadAdquirida,
                    proyecto:idProyecto
                }
            })            
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }

    },

    createNumeroFactura : async (req,res) => {

        try {

            const errors = validationResult(req);

            if(!errors.isEmpty()) throw{
                status:400,
                message:errors.mapped()
            }

            const idInsumo = req.params.id;
            const {factura, idProyecto} = req.body
            const facturaInsumo = await addNumeroFactura(idInsumo, factura, idProyecto);

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Número de factura agregado correctamente!',
                    factura: factura,
                    proyecto:idProyecto
                }
            })            
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }


    },

    createDetalleInsumo: async (req,res) => {

        try {

            const errors = validationResult(req);

            if(!errors.isEmpty()) throw{
                status:400,
                message:errors.mapped()
            }

            const idInsumo = req.params.id;
            const {detalle, idProyecto} = req.body
            const detalleInsumo = await addDetalleInsumo(idInsumo, detalle, idProyecto);

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Detalle creado correctamente!',
                    detalle: detalle
                }
            })            
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }


    },

    calcularRemanentes: async (req,res) => {
        try {

            const proyectoId = req.body.proyectoId

            const data = await getRemanentes(proyectoId)

            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre", "Unidad de Medida", "Cantidad Estandar Requerida" ,"Cantidad Adquirida", "Remanentes"]);
    
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
    
            data.forEach(item=> {
                const row = worksheet.addRow([item.nombre, item.unidadDeMedida, item.cantidadRequerida, item.cantidadAdquirida, item.remanentes]);
                
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-informeRemanentes.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();             
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }



}