const fs = require('fs');
const path = require('path');
const {validationResult} = require('express-validator');
const { Op } = require("sequelize");

const db = require("../database/models")

module.exports = {

    list : (req,res) => {          
        return res.render('licitaciones',{
            title: 'Licitaciones',        
        }) 
    },

    verTodas : (req,res) => {    
                return res.render('adminLicitaciones',{
                title: 'Administrar Licitaciones',     
            })      
    },


    agregar : (req,res) => {      
        db.Tipos.findAll({
            attributes:{exclude:['createdAt','updatedAt']},
            order : [['nombre']],
        })
        .then(tipos =>{
            return res.render('agregarLic',{
                title: 'Nueva Publicación',
                tipos,                
            })
        })
        .catch(error => console.log(error))
    },

    store: async (req, res) => {

        // Función para eliminar el archivo subido en caso de error
        function eliminarArchivo(filePath) {
            try {
                fs.unlinkSync(filePath);
                console.log(`Archivo ${filePath} eliminado correctamente.`);
            } catch (error) {
                console.error(`Error al eliminar archivo: ${filePath}`, error);
            }
        }

        const errors = validationResult(req);
        const filePath = req.file ? path.join(__dirname, `../../public/images/licitaciones/${req.file.filename}`) : null;

        // Validar que solo se suban extensiones permitidas (pdf) y que haya un archivo
        if (req.fileValidationError) {
            errors.errors.push({
                value: "",
                msg: req.fileValidationError,
                param: "pdf",
                location: "file",
            });
        }

        if (!req.file) {
            errors.errors.push({
                value: "",
                msg: "Debe subir el archivo",
                param: "pdf",
                location: "file",
            });
        }

        // Si no hay errores, crear la publicación
        if (errors.isEmpty()) {
            try {
                const { expediente, titulo, objetivo, tipo } = req.body;

                await db.Publicaciones.create({
                    expediente: expediente.trim(),
                    titulo: titulo.trim(),
                    objetivo: objetivo.trim(),
                    tipoId: tipo,
                    archivo: req.file ? req.file.filename : null,
                });

                return res.redirect('/licitacion/publicaciones');
            } catch (error) {
                console.error('Error al crear la publicación:', error);
                return res.status(500).send('Hubo un problema al guardar la publicación.');
            }
        } else {
            // Si hay errores, eliminar el archivo subido y volver a renderizar el formulario
            if (req.file && fs.existsSync(filePath)) {
                eliminarArchivo(filePath);
            }

            try {
                const tipos = await db.Tipos.findAll({ order: [['nombre']] });

                return res.render('agregarLic', {
                    title: 'Nueva Publicación',
                    tipos,
                    errors: errors.mapped(),
                    old: req.body,
                });
            } catch (error) {
                console.error('Error al cargar tipos:', error);
                return res.status(500).send('Hubo un problema al cargar los tipos.');
            }
        }
    },

    edit: async (req, res) => {
        try {
            const { id } = req.params;

            // Ejecutar ambas consultas de forma concurrente con Promise.all
            const [publicacion, tipos] = await Promise.all([
                db.Publicaciones.findByPk(id), // Buscar la publicación
                db.Tipos.findAll({ // Buscar los tipos para el select del formulario
                    attributes: { exclude: ['createdAt', 'updatedAt'] },
                }),
            ]);

            // Si no se encuentra la publicación, retornar un error
            if (!publicacion) {
                return res.status(404).send('Publicación no encontrada');
            }

            // Renderizar la vista con los datos obtenidos
            return res.render('editarLic', {
                tipos,
                publicacion,
                title: 'Editar Publicación',
            });

        } catch (error) {
            console.error('Error en el controlador de edición:', error);
            return res.status(500).send('Hubo un problema al cargar la página de edición');
        }
    },

    update: async (req, res) => {
        try {
            const errors = validationResult(req);

            // Validar si hubo un error con el archivo subido
            if (req.fileValidationError) {
                errors.errors.push({
                    value: "",
                    msg: req.fileValidationError,
                    param: "pdf",
                    location: "file"
                });
            }

            // Si no hay errores, proceder con la actualización
            if (errors.isEmpty()) {
                const { expediente, titulo, objetivo, tipo } = req.body;
                const { id } = req.params;

                // Si se subió un nuevo archivo, eliminar el anterior
                if (req.file) {
                    const publicacion = await db.Publicaciones.findByPk(id);
                    if (publicacion && publicacion.archivo) {
                        const filePath = path.join(__dirname, `../../public/images/licitaciones/${publicacion.archivo}`);
                        if (fs.existsSync(filePath)) {
                            fs.unlinkSync(filePath);
                        }
                    }
                }

                // Actualizar la publicación
                await db.Publicaciones.update({
                    expediente: expediente.trim(),
                    titulo: titulo.trim(),
                    objetivo: objetivo.trim(),
                    tipoId: tipo,
                    archivo: req.file ? req.file.filename : undefined
                }, {
                    where: { id }
                });

                // Redireccionar después de la actualización
                return res.redirect('/licitacion/publicaciones');
            } else {
                // Si hay errores, eliminar el archivo recién subido si existe
                if (req.file) {
                    const newFilePath = path.join(__dirname, `../../public/images/licitaciones/${req.file.filename}`);
                    if (fs.existsSync(newFilePath)) {
                        fs.unlinkSync(newFilePath);
                    }
                }

                // Obtener datos para la vista de edición
                const [publicacion, tipos] = await Promise.all([
                    db.Publicaciones.findByPk(req.params.id),
                    db.Tipos.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } })
                ]);

                // Renderizar el formulario con los errores y los datos actuales
                return res.render('editarLic', {
                    tipos,
                    publicacion,
                    title: 'Editar Publicación',
                    errors: errors.mapped(),
                    old: req.body
                });
            }
        } catch (error) {
            console.error('Error en la actualización de publicación:', error);
            return res.status(500).send('Error en la actualización de la publicación');
        }
    },

    remove : (req,res) => {

        db.Publicaciones.destroy({
            where : {id:req.params.id},
            force:true
        }).then(() => {
            return res.redirect('/licitacion/publicaciones')
        })
        .catch(error => console.log(error))

    }, 

    search : (req,res) => {     

        const query = req.query.search;
        db.Publicaciones.findAll({
            where : {
                titulo : {
                    [Op.like] : `%${query}%`
                }
            },
            include : ['tipo'],
            attributes:{exclude:['createdAt','updatedAt']},
        })
        .then(publicaciones => {
            return res.render('resultado',{
                publicaciones,
                title : 'Resultado de la busqueda',               
            })
        })
        .catch(error => console.log(error))
    },

    searchLicitacion : (req,res) => {        

        const querySearch = req.query.search;
        db.Publicaciones.findAll({
            where : {
                titulo : {
                    [Op.like] : `%${querySearch}%`
                }
            },
            include : ['tipo'],
            attributes:{exclude:['createdAt','updatedAt']},

        })
        .then(publicaciones => {
            return res.render('searchLicitacion',{
                publicaciones,
                title : 'Resultado de la busqueda',
               
            })
        })
        .catch(error => console.log(error))
    }

}