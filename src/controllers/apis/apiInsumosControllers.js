const { validationResult } = require('express-validator');
const createResponseError = require('../../helpers/createResponseError');
const { addProyectoInsumos, addCantidadAdquirida, addNumeroFactura, addDetalleInsumo, getRemanentes } = require('../../services/insumosService');


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

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Insumos estandar e insumos adquiridos',
                    insumos: data                  
                }
            })      
            
        } catch (error) {
            console.log(error);
            return createResponseError(res, error)
        }
    }



}