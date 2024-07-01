const { validationResult } = require('express-validator');
const createResponseError = require('../../helpers/createResponseError');
const { addProyectoInsumos, addCantidadAdquirida, addNumeroFactura, addDetalleInsumo } = require('../../services/insumosService');


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
            const cantidadAdquirida = req.body.cantidadAdquirida
            const insumoProyecto = await addCantidadAdquirida(idInsumo, cantidadAdquirida);

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Cantidad Adquirida actualizada correctamente!',
                    cantidad: cantidadAdquirida
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
            const factura = req.body.factura
            const facturaInsumo = await addNumeroFactura(idInsumo, factura);

            return res.status(200).json({
                ok:true,
                data:{
                    message:'Número de factura agregado correctamente!',
                    factura: factura
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
            const detalle = req.body.detalle
            const detalleInsumo = await addDetalleInsumo(idInsumo, detalle);

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



}