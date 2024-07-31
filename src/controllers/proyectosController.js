const fs = require('fs');
const { validationResult } = require('express-validator');
const { Op } = require("sequelize");
const ExcelJS = require('exceljs');
const db = require('../database/models');
const path = require('path');
const { error } = require('console');



module.exports = {

    listProyects: (req, res) => {

        db.Proyecto.findAll({
            include: [{
                model: db.proyectoProducto,
                as: "productoProyecto",
                include: [
                    {
                        model: db.Producto,
                        as: "producto"
                    }
                ]
            },           
            ]
        })
            .then(proyectos => {              
                return res.render('stock/proyectos/proyectos', {
                    title: 'Proyectos Productivos',
                    proyectos
                })
            }).catch(error => console.log(error))


    },

    listDelayedProjects: async(req, res) => {
        try {
            // Consultar todos los proyectos
            const proyectos = await db.Proyecto.findAll(
                {
                    include: [{
                        model: db.proyectoProducto,
                        as: "productoProyecto",
                        include: [
                            {
                                model: db.Producto,
                                as: "producto"
                            }
                        ]
                    },           
                    ]
                }                
            );
        
            // Obtener la fecha actual
            const fechaActual = new Date();
        
            // Filtrar los proyectos fuera de término
              const proyectosFueraDeTermino = proyectos.filter(proyecto => {
              const { createdAt, duracion, unidadDuracion } = proyecto;
        
              // Convertir la fecha de creación a un objeto Date
              const fechaCreacion = new Date(createdAt);
        
              // Calcular la fecha de vencimiento
              let fechaVencimiento;
              switch (unidadDuracion) {
                case 'dia':
                  fechaVencimiento = new Date(fechaCreacion);
                  fechaVencimiento.setDate(fechaVencimiento.getDate() + duracion);
                  break;
                case 'semana':
                  fechaVencimiento = new Date(fechaCreacion);
                  fechaVencimiento.setDate(fechaVencimiento.getDate() + (duracion * 7));
                  break;
                case 'mes':
                  fechaVencimiento = new Date(fechaCreacion);
                  fechaVencimiento.setMonth(fechaVencimiento.getMonth() + duracion);
                  break;
                default:
                  return false; // Si la unidad de duración no es válida, no consideres este proyecto
              }
        
              // Comparar la fecha de vencimiento con la fecha actual
              return fechaActual > fechaVencimiento;
            });
            
           

            // Enviar los proyectos fuera de término a la vista
           return res.render('stock/proyectos/proyectosRetrasados', {
            title:"Proyectos fuera de termino",
            proyectosFueraDeTermino });
          } catch (error) {
            console.error('Error al obtener proyectos fuera de término:', error);
            res.status(500).send('Ocurrió un error al obtener los proyectos fuera de término.');
          }
    },

    addNewProyect: (req, res) => {

        const talleres = db.Taller.findAll({
            attributes: ['id', 'nombre'],
            where: {estado:"Aprobado"},
            include: [{
                model: db.destinoUsuario,
                as: 'destinoTaller',
                attributes: ['id', 'nombreDestino']
            }],
        },    
        )
        const productos = db.Producto.findAll({
            attributes: ['id', 'nombre'],
        })

       

        Promise.all(([talleres, productos, ]))
            .then(([talleres, productos,]) => {

                return res.render('stock/proyectos/addProyect', {
                    title: 'Nuevo Proyecto',
                    talleres,
                    productos,
                   
                })
            }).catch(error => console.log(error));
    },

    storeProyect: async (req, res) => {       

        try {

            const errors = validationResult(req);

            if (req.fileValidationError) { //este if valida que solo se puedan subir extensiones (pdf)
                errors.errors.push({
                    value: "",
                    msg: req.fileValidationError,
                    param: "pdf",
                    location: "file"
                })
            }

            if (!req.file) {  //este if valida que se suba un pdf
                errors.errors.push({
                    value: "",
                    msg: "Debe subir el archivo",
                    param: "pdf",
                    location: "file"
                })
            }

            if (errors.isEmpty()) {               

                const { nombre, expediente, destino, productos, detalle, duracion, unidadDuracion } = req.body

                const usuario = await db.Usuario.findOne({
                    where: { destinoId: req.session.userLogin.destinoId },
                    include: [{
                        model: db.destinoUsuario,
                        as: "destino",
                        attributes: ["nombreDestino"]
                    }]
                });

                    const procedencia = usuario.destino.nombreDestino //obtengo la procedencia del proyecto a través del destino del usuario
             

                    const costoTotal = productos.reduce((total, producto) => {
                    const costoUnitario = parseFloat(producto.costoUnitario) || 0;
                    const cantidad = parseFloat(producto.cantidad) || 0;

                    const costoProducto = costoUnitario * cantidad; // Calcular el costo del producto actual
                    return total + costoProducto; // Sumar al total el costo del producto actual
                }, 0);

               
                const proyecto = await db.Proyecto.create({  //CREO EL PROYECTO
                    nombre: nombre.trim(),
                    expediente: expediente,
                    idTaller: destino,                   
                    detalle: detalle.trim(),
                    insumosAdquirir: req.file ? req.file.filename : null,
                    procedencia: procedencia,
                    duracion: duracion,
                    unidadDuracion: unidadDuracion,
                    costoTotalProyecto: costoTotal,
                    estado: 'Pendiente',                   
                })         

                const parte = await db.Parte.create({  //CREO EL PARTE ASOCIADO AL PROYECTO
                    nombre: nombre.trim(),
                    expediente: expediente,
                    idTaller: destino,
                    detalle: detalle.trim(),
                    procedencia: procedencia,
                    duracion: duracion,
                    unidadDuracion: unidadDuracion,                    
                    idProyecto: proyecto.id,
                })

                const productosFiltrados = req.body.productos.filter(producto => producto.id); // filtro el array productos para eliminar cualquier posición vacía

               

                const proyectoProductos = await productosFiltrados.forEach(producto => {  //GUARDO LOS REGISTROS DE PRODUCTOS DEL PROYECTO
                    db.proyectoProducto.create({
                        proyectoId: proyecto.id,
                        parteId: parte.id,
                        productoId: producto.id,
                        cantidadAProducir: producto.cantidad,
                        costoUnitario: producto.costoUnitario,
                        costoTotal: producto.cantidad * producto.costoUnitario,                    
                    })
                })       
                            
                return res.redirect('/stock/listProyects')

            } else {

                if (req.file) {
                    fs.existsSync(path.join(__dirname, `../../public/images/anexos/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname, `../../public/images/anexos/${req.file.filename}`))
                }

                const talleres = db.Taller.findAll({
                    attributes: ['id', 'nombre'],
                    include: [{
                        model: db.destinoUsuario,
                        as: 'destinoTaller',
                        attributes: ['id', 'nombreDestino']
                    }],
                })
                const productos = db.Producto.findAll({
                    attributes: ['id', 'nombre'],
                })

             

                Promise.all(([talleres, productos, ]))
                    .then(([talleres, productos, ]) => {

                        return res.render('stock/proyectos/addProyect', {
                            title: 'Nuevo Proyecto',
                            talleres,
                            productos,                            
                            old: req.body,
                            errors: errors.mapped()
                        })
                    }).catch(error => console.log(error));

            }

        } catch (error) {
            console.log(error);
        }
    },

    editProyect: (req, res) => {

        const id = req.params.id

        const talleres = db.Taller.findAll({
            attributes: ['id', 'nombre'],
            include: [{
                model: db.destinoUsuario,
                as: 'destinoTaller',
                attributes: ['id', 'nombreDestino']
            }],
        })
        const productos = db.Producto.findAll({
            attributes: ['id', 'nombre'],
        })

        const proyecto = db.Proyecto.findOne({
            where: { id: id }
        })

     


        Promise.all(([talleres, productos, proyecto, ]))
            .then(([talleres, productos, proyecto, ]) => {

                return res.render('stock/proyectos/editProyect', {
                    title: 'Nuevo Proyecto',
                    talleres,
                    productos,
                    proyecto,                   
                })
            }).catch(error => console.log(error));

    },

  

    updateProyect: async (req, res) => {

        try {

            const errors = validationResult(req);

            if(req.fileValidationError){ //este if valida que solo se puedan subir extensiones (pdf)
                errors.errors.push({
                    value : "",
                    msg : req.fileValidationError,
                    param : "pdf",
                    location : "file"
                })
            }

            const id = req.params.id

            const { nombre, expediente, destino, detalle, duracion, unidadDuracion, ficha } = req.body

            const usuario = await db.Usuario.findOne({ //busco el usuario para poder acceder al destino de procedencia y cargarlo despues en los registros
                where: { destinoId: req.session.userLogin.destinoId },
                attributes: [],
                include: [{
                    model: db.destinoUsuario,
                    as: "destino",
                    attributes: ["nombreDestino"]
                }]
            })

            const procedencia = usuario.destino.nombreDestino         


            if (errors.isEmpty()) {

                const proyectoAnterior = await db.Proyecto.findOne({ where: { id: id } }) //busco el proyecto en su version vigente antes de ser editado

                await db.Historial.create({  
                    nombre: proyectoAnterior.nombre,
                    expediente:expediente,
                    idTaller: proyectoAnterior.idTaller,                  
                    detalle: proyectoAnterior.detalle,
                    insumos: proyectoAnterior.insumosAdquirir,
                    procedencia: proyectoAnterior.procedencia,
                    duracion: proyectoAnterior.duracion,
                    unidadDuracion: proyectoAnterior.unidadDuracion,   
                    costoTotalProyecto:proyectoAnterior.costoTotalProyecto,              
                    idProyecto: id,
                    estado: proyectoAnterior.estado
                })

             const proyectoUpdate = await db.Proyecto.update({ //actualizo el proyecto con los nuevos datos enviados por el usuario
                    nombre: nombre.trim(),
                    expediente: proyectoAnterior.expediente,
                    idTaller: destino,                    
                    insumosAdquirir: req.file ? req.file.filename : proyectoAnterior.insumosAdquirir,
                    detalle: detalle,
                    procedencia: procedencia,
                    duracion: duracion,
                    unidadDuracion: unidadDuracion,                                         
                    estado: proyectoAnterior.estado
                },
                    {
                        where: {
                            id: req.params.id
                        }
                    })

                    if(req.file){
                        fs.existsSync(path.join(__dirname, `../../public/images/insumos/${proyectoAnterior.insumosAdquirir}`)) && fs.unlinkSync(path.join(__dirname, `../../public/images/insumos/${proyectoAnterior.insumosAdquirir}`))
                     }    


                await db.Parte.update({ //actualizo el parte semanal con los datos actualizados del proyecto
                    nombre: nombre.trim(),
                    expediente: expediente,
                    idTaller: destino,
                    detalle: detalle.trim(),
                    procedencia: procedencia,
                    duracion: duracion,
                    unidadDuracion: unidadDuracion,
                    idFicha: ficha,
                    idProyecto: proyectoUpdate.id ,
                }, {
                    where: {
                        idProyecto: req.params.id
                    }
                })

                return res.redirect('/stock/listProyects')

            } else {           
             
                if (req.file) {
                    fs.existsSync(path.join(__dirname, `../../public/images/insumos/${req.file.filename}`)) && fs.unlinkSync(path.join(__dirname, `../../public/images/insumos/${req.file.filename}`))
                }

                const id = req.params.id

                const talleres = db.Taller.findAll({
                    attributes: ['id', 'nombre'],
                    include: [{
                        model: db.destinoUsuario,
                        as: 'destinoTaller',
                        attributes: ['id', 'nombreDestino']
                    }],
                })
                const productos = db.Producto.findAll({
                    attributes: ['id', 'nombre'],
                })

                const proyecto = db.Proyecto.findOne({
                    where: { id: id }
                })

                
              

                Promise.all(([talleres, productos, proyecto, ]))
                    .then(([talleres, productos, proyecto,]) => {

                        return res.render('stock/proyectos/editProyect', {
                            title: 'Editar Proyecto',
                            talleres,
                            productos,                           
                            proyecto,
                            old: req.body,
                            errors: errors.mapped()
                        })
                    }).catch(error => console.log(error));
            }

        } catch (error) {
            console.log(error);
        }


    },

    editProducts: async (req,res) => {
        try {
           const id = req.params.id;

           const productos = await db.proyectoProducto.findAll(
            {
                where:{proyectoId:id},
                include: [{
                    model: db.Producto,
                    as: 'producto',
                    attributes: ['nombre']
                }],
            })
           const proyecto = await db.Proyecto.findByPk(id)

           const productosNuevos = await db.Producto.findAll({
            attributes:["id", "nombre"]
           })           
          
           
           return res.render('stock/proyectos/editProducts',{
            title:'Editar Productos',
            productos,
            proyecto,
            productosNuevos
           })


        } catch (error) {
            console.log(error);
        }
    },

    deleteProyect: async (req, res) => {


        try {
            const id = req.params.id

            const destroyProducts = await db.proyectoProducto.destroy({where:{proyectoId:id}})

            /* const destroyhistorial = await db.Historial.destroy({ where: { idProyecto: id } }) */

            const destroyParte = await db.Parte.destroy({ where: { idProyecto: id } })

            const destroyProyecto = await db.Proyecto.destroy({ where: { id: id } })


            return res.redirect('/stock/listProyects')

        } catch (error) {
            console.log(error);
        }
    },

    downloadExcelHistorial: async (req, res) => {

        try {
            const id = req.params.id;
            const tablaHistorial = await db.Historial.findAll({
                where: { idProyecto: id },
                include: [{
                    model: db.Proyecto,
                    as: 'historialProyecto',
                    attributes: ["nombre", "estado", "detalle", "expediente", "procedencia", "duracion", "unidadDuracion", "costoTotalProyecto", "insumosAdquirir", "createdAt"],
                    include: [{
                        model: db.proyectoProducto,
                        as: "productoProyecto",
                        attributes: ["cantidadAProducir", "costoUnitario", "costoTotal"],
                        include: [
                            {
                                model: db.Producto,
                                as: "producto",
                                attributes: ["nombre"]
                            }
                        ]
                    }]
                }]
            });
    
            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 
    
            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Proyecto", "Estado", "Detalle", "Expediente Reformulación", "Procedencia", 'Duración', 'Productos', 'Costo total Proyecto', 'Insumos a adquirir', 'Fecha de creación del proyecto']);
    
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
    
            tablaHistorial.forEach(historial => {
                const proyecto = historial.historialProyecto;
    
                const cantidades = proyecto.productoProyecto.map(item => item.cantidadAProducir);
                const productos = proyecto.productoProyecto.map(item => item.producto.nombre);
                const costos = proyecto.productoProyecto.map(item => item.costoUnitario);
    
                const resultado = cantidades.map((cantidad, index) => {
                    const producto = productos[index];
                    const costo = costos[index];
                    return `${cantidad} - ${producto} - $ ${costo} c/u`;
                });
    
                // Construir la URL completa del archivo PDF
                const urlPDF = `https://test.encope.gob.ar/images/insumos/${proyecto.insumosAdquirir}`;
                const linkText = `Descargar anexo 3`;
    
                const row = worksheet.addRow([proyecto.nombre, proyecto.estado, proyecto.detalle, historial.expediente, proyecto.procedencia, `${proyecto.duracion} - ${proyecto.unidadDuracion}`, `${resultado.join(", ")}`, proyecto.costoTotalProyecto, linkText, proyecto.createdAt]);
    
                // Obtener la celda del enlace
                const linkCell = row.getCell(9); // Cambiar el índice según la posición de la columna del enlace
    
                // Aplicar el estilo de color azul y subrayado al enlace
                linkCell.font = { color: { argb: 'FF0000FF' }, underline: true };
    
                // Agregar la URL como hipervínculo
                worksheet.getCell(linkCell.address).value = { text: linkText, hyperlink: urlPDF };
    
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-tablaHistorialProyectos.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    
            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);
    
            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }

    },

    downloadExcelProyects: async (req, res) => {

        try {

            const tablaProyects = await db.Proyecto.findAll({
                include: [{
                    model: db.proyectoProducto,
                    as: "productoProyecto",
                    include: [
                        {
                            model: db.Producto,
                            as: "producto"
                        }
                    ]
                },           
                ]
            }); // Traigo mi consulta

            const workbook = new ExcelJS.Workbook(); // Función constructora del Excel
            const worksheet = workbook.addWorksheet('Sheet 1'); // Crea una hoja de Excel 

            // Agregar títulos de columnas
            const titleRow = worksheet.addRow(["Nombre Proyecto", "Estado", "Detalle", "Expediente", "Procedencia", 'Duración', 'Productos', 'Costo total Proyecto', 'Insumos a adquirir' ,'fecha de creación del proyecto']);

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

            tablaProyects.forEach(proyecto => {

                const cantidades = proyecto.productoProyecto.map(item => item.cantidadAProducir);
                const productos = proyecto.productoProyecto.map(item => item.producto.nombre);
                const costos = proyecto.productoProyecto.map(item => item.costoUnitario)

                const resultado = cantidades.map((cantidad, index) => {
                    const producto = productos[index];
                    const costo = costos[index];
                    return `${cantidad} - ${producto} - $ ${costo} c/u`;
                });
                            
                  // Construir la URL completa del archivo PDF
                  const urlPDF = `https://test.encope.gob.ar/images/insumos/${proyecto.insumosAdquirir}`;
                  const linkText = `Descargar anexo 3`;


                const row = worksheet.addRow([proyecto.nombre, proyecto.estado, proyecto.detalle, proyecto.expediente, proyecto.procedencia, `${proyecto.duracion} - ${proyecto.unidadDuracion}`, `${resultado.join(", ")}` , proyecto.costoTotalProyecto,linkText , proyecto.createdAt]);

                // Obtener la celda del enlace
                const linkCell = row.getCell(9); // Cambiar el índice según la posición de la columna del enlace
            
                // Aplicar el estilo de color azul y subrayado al enlace
                linkCell.font = { color: { argb: 'FF0000FF' }, underline: true };
            
                // Agregar la URL como hipervínculo
                worksheet.getCell(linkCell.address).value = { text: linkText, hyperlink: urlPDF };

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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-tablaDeProyectosProductivos.xlsx"`); // agregar al nombre la fecha con New Date()
            res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');

            // Envia el archivo Excel como respuesta al cliente
            await workbook.xlsx.write(res);

            // Finaliza la respuesta
            res.end();
        } catch (error) {
            console.log(error);
        }

    },

    searchProyect: async (req, res) => {

        const { expediente, taller, procedencia } = req.body;

        const findProyecto = async (whereCondition) => {
            return await db.Proyecto.findOne({
                where: whereCondition,
                include: [{
                    model: db.proyectoProducto,
                    as: "productoProyecto",
                    include: [{ model: db.Producto, as: "producto" }]
                }]
            });
        };
    
        const findParte = async (proyectoId) => {
            return await db.Parte.findOne({
                where: { idProyecto: proyectoId },
                include: [{
                    model: db.proyectoProducto,
                    as: "productoParte",
                    include: [{ model: db.Producto, as: "producto" }]
                }]
            });
        };
    
        const calculateMetrics = (parte) => {
            const cantidadTotalAProducir = parte.productoParte.reduce((total, producto) => total + producto.cantidadAProducir, 0);
            const cantidadTotalProducida = parte.productoParte.reduce((total, producto) => total + producto.cantidadProducida, 0);
            const porcentajeAvance = (cantidadTotalProducida / cantidadTotalAProducir) * 100;
            const ideal = cantidadTotalAProducir / parte.duracion;
            const real = cantidadTotalProducida / parte.duracion;
    
            return { porcentajeAvance: porcentajeAvance.toFixed(2), ideal, real };
        };
    
        try {
            let proyecto;
            if (expediente) {
                proyecto = await findProyecto({ expediente });
            } else if (taller) {
                proyecto = await findProyecto({ idTaller: taller });
            } else if (procedencia) {
                proyecto = await findProyecto({ procedencia });
            }
    
            if (proyecto) {
                const parte = await findParte(proyecto.id);
                if (parte) {
                    const metrics = calculateMetrics(parte);
                    return res.render('stock/proyectos/searchProyect', {
                        title: 'Resultado de la búsqueda',
                        proyecto,
                        parte,
                        ...metrics
                    });
                }
            }
    
            // Renderizar una vista con un mensaje indicando que no se encontraron resultados
            return res.render('stock/proyectos/searchProyect', {
                title: 'Sin resultados'
            });
    
        } catch (error) {
            console.log(error);
            // Renderizar una vista de error si es necesario
            return res.render('stock/proyectos/searchProyect', {
                title: 'Error en la búsqueda',
                error: error.message
            });
        }
       
    }
    
}