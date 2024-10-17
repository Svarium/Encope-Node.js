const db = require("../../database/models");
const { validationResult } = require("express-validator");

module.exports = {
    addInsumo: (req, res) => {
        const idProducto = req.params.id;

        db.Producto.findByPk(idProducto)
            .then((producto) => res.render("stock/insumos/addInsumo", {
                title: "Agregar Insumo",
                producto,
            }))
            .catch((error) => {
                console.error(error);
                res.status(500).send({ message: "Error interno del servidor" });
            });
    },

    storeInsumo: (req, res) => {
        const errors = validationResult(req);
        const idProducto = req.params.id;

        if (!errors.isEmpty()) {
            return db.Producto.findByPk(idProducto)
                .then((producto) => res.render("stock/insumos/addInsumo", {
                    title: "Agregar Insumo",
                    producto,
                    old: req.body,
                    errors: errors.mapped(),
                }))
                .catch((error) => {
                    console.error(error);
                    res.status(500).send({ message: "Error interno del servidor" });
                });
        }

        const { nombre, unidad, cantidad, detalle = "Sin detalle asociado" } = req.body;

        db.Insumo.create({
            nombre: nombre.trim(),
            unidadDeMedida: unidad.trim(),
            cantidad,
            detalle,
            idProducto,
        })
        .then(() => res.redirect("/stock/products"))
        .catch((error) => {
            console.error(error);
            res.status(500).send({ message: "Error interno del servidor" });
        });
    },

    reportInsumos: async (req, res) => {
        try {
            const idproyecto = req.params.id;
            const parte = await db.Parte.findOne({
                where: { id: idproyecto },
                attributes: ["nombre", "id"],
                include: [{
                    model: db.proyectoProducto,
                    as: "productoParte",
                    attributes: ["cantidadAProducir"],
                    include: [{
                        model: db.Producto,
                        as: "producto",
                        attributes: ["nombre", "id", "imagen"],
                        include: [{
                            model: db.Insumo,
                            as: "productos",
                            attributes: ["id", "nombre", "unidadDeMedida", "cantidad"],
                        }],
                    }],
                }],
            });

            if (!parte) {
                return res.status(404).send({ message: "Parte no encontrada" });
            }

            const registros = await db.insumoProyecto.findAll({
                where: { proyectoId: idproyecto },
                attributes: ["id", "cantidadAdquirida", "insumoId", "factura", "detalle"],
            });

            const registrosMap = Object.fromEntries(
                registros.map(({ insumoId, ...rest }) => [insumoId, rest])
            );

            const data = parte.productoParte.map((productoParte) => ({
                producto: {
                    id: productoParte.producto.id,
                    nombre: productoParte.producto.nombre,
                    imagen: productoParte.producto.imagen,
                    cantidadAProducir: productoParte.cantidadAProducir,
                },
                insumos: productoParte.producto.productos.map((insumo) => ({
                    id: insumo.id,
                    nombre: insumo.nombre,
                    unidadDeMedida: insumo.unidadDeMedida,
                    cantidad: insumo.cantidad,
                    ...registrosMap[insumo.id],
                })),
            }));

            res.render("stock/partes/informeInsumos", {
                title: "Informar insumos",
                idproyecto,
                data,
                nombreProyecto: parte.nombre,
                proyectId: parte.id,
                registros,
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ message: "Error interno del servidor" });
        }
    },
};
