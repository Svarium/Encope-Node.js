const db = require("../database/models")
const {validationResult} = require('express-validator')


module.exports = {

    addInsumo : (req,res) => {

        idProducto = req.params.id;

        db.Producto.findByPk(idProducto)
        .then(producto => {
            return res.render('stock/insumos/addInsumo',{
                title: "Agregar Insumo",
                producto
            })
        })
        .catch(error => console.log(error))
    },

    storeInsumo:(req,res) => {

        const errors = validationResult(req);
        const idProducto = req.params.id;

        if (errors.isEmpty()) {

        const {nombre, unidad, cantidad, detalle} = req.body;       

        db.Insumo.create({
            nombre:nombre.trim(),
            unidadDeMedida:unidad.trim(),
            cantidad:cantidad,
            detalle: detalle ? detalle : "Sin detalle asociado",
            idProducto:idProducto
        })        
             .then(() => {
                
                return res.redirect('/stock/products')
             })
             .catch(error => console.log(error))      
        
        } else {

            db.Producto.findByPk(idProducto)
            .then(producto => {
                return res.render('stock/insumos/addInsumo',{
                    title: "Agregar Insumo",
                    producto,
                    old:req.body,
                    errors: errors.mapped()
                })
            })
            .catch(error => console.log(error))
        }
    },

    reportInsumos: async (req, res) => {
        try {
            const idproyecto = req.params.id;
    
            const parte = await db.Parte.findOne({
                where: { id: idproyecto },
                attributes: ["nombre", "id"],
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
                            attributes: ["id", "nombre", "unidadDeMedida", "cantidad"]
                        }]
                    }]
                }],
            });
    
            if (!parte) {
                return res.status(404).send({ message: 'Parte no encontrada' });
            }
    
            const registros = await db.insumoProyecto.findAll({
                where: {
                     proyectoId: idproyecto
                },
                attributes: ['id', 'cantidadAdquirida', 'insumoId', 'factura', 'detalle']
            });
    
            // Convertimos registros a un objeto para facilitar la búsqueda
            const registrosMap = registros.reduce((acc, registro) => {
                acc[registro.insumoId] = {
                    cantidadAdquirida: registro.cantidadAdquirida,
                    factura: registro.factura,
                    detalle: registro.detalle
                }
                return acc;
            }, {});
    
            const data = parte.productoParte.map(productoParte => {
                return {
                    producto: {
                        id: productoParte.producto.id,
                        nombre: productoParte.producto.nombre,
                        imagen: productoParte.producto.imagen,
                        cantidadAProducir: productoParte.cantidadAProducir,
                    },
                    insumos: productoParte.producto.productos.map(insumo => {
                        const registro = registrosMap[insumo.id];
                        return {
                            id: insumo.id,
                            nombre: insumo.nombre,
                            unidadDeMedida: insumo.unidadDeMedida,
                            cantidad: insumo.cantidad,
                            cantidadAdquirida: registro ? registro.cantidadAdquirida : null, // Agregar cantidadAdquirida
                            factura: registro ? registro.factura : null, // Agregar factura
                            detalle: registro ? registro.detalle : null // Agregar detalle
                        };
                    })
                };
            });
    
            const nombreProyecto = parte.nombre;
            const proyectId = parte.id;
    
            return res.render('stock/partes/informeInsumos', {
                title: "Informar insumos",
                idproyecto,
                data,
                nombreProyecto,
                proyectId,
                registros
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Error interno del servidor' });
        }
    }
    ,

}