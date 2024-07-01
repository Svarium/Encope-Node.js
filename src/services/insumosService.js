const db = require('../database/models');


module.exports = {
    addProyectoInsumos : async (proyectoId) => { //recibo el id del proyecto
        try {
            const parte = await db.Parte.findOne({ //traigo el proyecto con sus relaciones
                where: { id: proyectoId },
                attributes: ["nombre"],
                include: [{
                    model: db.proyectoProducto,
                    as: 'productoParte',
                    attributes: ["cantidadAProducir"],
                    include: [{
                        model: db.Producto,
                        as: 'producto',
                        attributes: ["nombre", "id", "imagen"],
                        include: [{
                            model: db.Insumo,
                            as: "productos",
                            attributes: ["id", "nombre", "unidadDeMedida" , "cantidad"]
                        }]
                    }]
                }],
            });

            const data = parte.productoParte.map(productoParte => { //formateo la informacion para poder iterar mejor
                return {
                    producto: {
                        id: productoParte.producto.id,
                        nombre: productoParte.producto.nombre,
                        imagen: productoParte.producto.imagen,
                        cantidadAProducir: productoParte.cantidadAProducir,
                    },
                    insumos: productoParte.producto.productos.map(insumo => ({
                        id: insumo.id,
                        nombre: insumo.nombre,
                        unidadDeMedida: insumo.unidadDeMedida,
                        cantidad: insumo.cantidad
                    }))
                };
            });

            data.forEach(item => {  //itero mi array para crear un registro en cada ciclo
                let aProducir = item.producto.cantidadAProducir
                item.insumos.forEach(insumo => {             
                    db.insumoProyecto.create({
                        cantidadRequerida: +insumo.cantidad * +aProducir  ,
                        proyectoId: proyectoId,
                        productoId: item.producto.id,
                        insumoId:insumo.id
                    })
                })
            });

            return 

        } catch (error) {
            console.log(error);
        throw{
            status:500,
            message:error.message,
        }        
        }
    },

    addCantidadAdquirida: async (idInsumo, cantidadAdquirida, idProyecto) => {
        try {
            const cantidad = await db.insumoProyecto.update( {
                cantidadAdquirida:cantidadAdquirida
            },{
                where:{
                    insumoId:idInsumo,
                    proyectoId:idProyecto
                }
            })
            return cantidad        
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
        }      
    },

    
    addNumeroFactura: async (idInsumo, factura, idProyecto) => {
        try {
            const addFactura = await db.insumoProyecto.update({
                factura:factura
            },{
                where:{insumoId:idInsumo, proyectoId:idProyecto}
            })
            return addFactura        
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
        }      
    },

    addDetalleInsumo: async (idInsumo, detalle, idProyecto) => {

        try {
            const addDetalle = await db.insumoProyecto.update({
                detalle:detalle
            },{
                where:{insumoId:idInsumo, proyectoId:idProyecto}
            })
            return addDetalle        
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
        }      
    }, 

}