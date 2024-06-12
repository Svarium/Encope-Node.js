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
                            attributes: ["id", "nombre", "unidadDeMedida" , "cantidad"]
                        }]
                    }]
                }],
            });
    
            if (!parte) {
                return res.status(404).send({ message: 'Parte no encontrada' });
            }
    
            const data = parte.productoParte.map(productoParte => {
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
    
            const nombreProyecto = parte.nombre;
            const proyectId = parte.id
            
    
            return res.render('stock/partes/informeInsumos', {
                title: "Informar insumos",
                idproyecto,
                data,
                nombreProyecto,
                proyectId
            });
        } catch (error) {
            console.error(error);
            return res.status(500).send({ message: 'Error interno del servidor' });
        }
    }

}