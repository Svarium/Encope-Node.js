const db = require("../database/models")
const {validationResult} = require('express-validator')
const { Op } = require('sequelize');
const { getAllStocks, getGeneralStock } = require("../services/cunasServices");
const ExcelJS = require('exceljs');


module.exports = {
    list : async (req,res) => {
        const userLogin = req.session.userLogin;

        const stock = db.Stock.findAll({ //ESTA CONSULTA ME TRAE UNA LISTA DE EL STOCK ASOCIADO A UN USUARIO Y POR ENDE A UN DESTINO
            where:{
                idDestino:userLogin.destinoId
            },
            include:[
                {model:db.Usuario,
                 as:'usuario',
                 attributes:{exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]},
                 include: [
                   { model: db.destinoUsuario,
                    as: 'destino',
                    attributes:{exclude:['provincia', 'ciudad', 'createdAt', 'updatedAt']}
                    }
                 ]                  
                
                },
                {
                    model: db.Producto,
                    as:'producto',
                    attributes: {exclude:['detalle','createdAt', 'updatedAt' ]}
                }
                
            ],
            order:[
                ['idProducto', 'DESC']
            ]
        })

        const cunas = db.Producto.findAll({ //ESTA CONSULTA TRAE TODOS LOS PRODUCTOS PARA MOSTRAR EN LA VISTA
            attributes:{exclude:['createdAt','updatedAt']},
            order : [['id']],
        })

        const user = db.Usuario.findOne({ //ESTA VISTA ME TRAE EL USUARIO
            where:{
                id:userLogin.id
            },
            include:[{
                model: db.destinoUsuario,
                as:'destino',
                attributes:{
                    exclude:["provincia", "ciudad", "createdAt", "updatedAt"]
                }
            }],
            attributes:{
                exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]
            }
        })


        Promise.all(([cunas, user, stock]))
        .then(([cunas, user, stock]) => {
            /* return res.send(cunas) */
            return res.render("cunas/listCunas",{
                cunas,
                user,
                stock,
                title:"Stock de Cunas"
            })
        })
    },

    moreStock: (req,res) => {
         
        const errors = validationResult(req);
        
       
            if(errors.isEmpty()){
                const {cantidad, producto} = req.body;
                const id = req.session.userLogin.id
                const destino = req.session.userLogin.destinoId
    
                db.Stock.create({
                    idUsuario:id,
                    idProducto:producto,
                    idDestino:destino,
                    cantidad:cantidad

                })
                .then(stock => {
                    if(stock.idProducto == 13){
                         db.Stock.update({
                            cantidad: db.Sequelize.literal(`cantidad - ${stock.cantidad}`)
                        }, {
                            where: {
                                idDestino: req.session.userLogin.destinoId,
                                idProducto: { [db.Sequelize.Op.ne]: 13 }
                            }
                        })
                        .then(() => {
                            return res.redirect('/cunas/listar')
                        })
                    } else {
                        return res.redirect('/cunas/listar')
                    }                
                })
                .catch(error => console.log(error))
    
                } else {
                    const userLogin = req.session.userLogin;

                    const stock = db.Stock.findAll({ //ESTA CONSULTA ME TRAE UNA LISTA DE EL STOCK ASOCIADO A UN USUARIO Y POR ENDE A UN DESTINO
                        where:{
                            idDestino:userLogin.destinoId
                        },
                        include:[
                            {model:db.Usuario,
                             as:'usuario',
                             attributes:{exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]},
                             include: [
                               { model: db.destinoUsuario,
                                as: 'destino',
                                attributes:{exclude:['provincia', 'ciudad', 'createdAt', 'updatedAt']}
                                }
                             ]                  
                            
                            },
                            {
                                model: db.Producto,
                                as:'producto',
                                attributes: {exclude:['detalle','createdAt', 'updatedAt' ]}
                            }
                            
                        ],
                        order:[
                            ['idProducto', 'DESC']
                        ]
                    })
            
                    const cunas = db.Producto.findAll({ //ESTA CONSULTA TRAE TODOS LOS PRODUCTOS PARA MOSTRAR EN LA VISTA
                        attributes:{exclude:['createdAt','updatedAt']},
                        order : [['id']],
                    })
            
                    const user = db.Usuario.findOne({ //ESTA VISTA ME TRAE EL USUARIO
                        where:{
                            id:userLogin.id
                        },
                        include:[{
                            model: db.destinoUsuario,
                            as:'destino',
                            attributes:{
                                exclude:["provincia", "ciudad", "createdAt", "updatedAt"]
                            }
                        }],
                        attributes:{
                            exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]
                        }
                    })
            
            
                    Promise.all(([cunas, user, stock]))
                    .then(([cunas, user, stock]) => {
                       /*  return res.send(stock) */
                        return res.render("cunas/listCunas",{
                            cunas,
                            user,
                            stock,
                            title:"Stock de Cunas",
                            old:req.body,
                            errors: errors.mapped()
                        })
                    })
                }            
    },

    updateStock: (req, res) => {
        const errors = validationResult(req);
        if (errors.isEmpty()) {
            const idStock = req.params.id;
            const idUser = req.session.userLogin.id;
            const destino = req.session.userLogin.destinoId
            const addCantidad = req.body.cantidad;
    
            db.Stock.findOne({
                where: {
                    id: idStock
                }
            }).then(stock => {
                if (stock.idProducto === 13) {
                    const updatedCantidad = parseInt(stock.cantidad, 10) + parseInt(addCantidad, 10);
    
                    // Actualizar el stock seleccionado
                    db.Stock.update({
                        cantidad: updatedCantidad
                    }, {
                        where: {
                            id: idStock
                        }
                    }).then(() => {
                        // Restar la cantidad de producto del stock seleccionado de los demás stocks
                        return db.Stock.update({
                            cantidad: db.Sequelize.literal(`cantidad - ${addCantidad}`)
                        }, {
                            where: {
                                idDestino: req.session.userLogin.destinoId,
                                idProducto: { [db.Sequelize.Op.ne]: 13 }
                            }
                        });
                    }).then(() => {
                        return db.Stock.update({
                            cantidad: db.Sequelize.literal(`cantidad - ${addCantidad}`)
                        }, {
                            where: {
                                idDestino: req.session.userLogin.destinoId,
                                idProducto: {
                                    [db.Sequelize.Op.in]: [5, 6, 7] // Aquí puedes especificar los valores de idProducto que deseas actualizar
                                },
                            }
                        })
                        .then(() => {
                            return res.redirect('/cunas/listar');
                        } )
                    }).catch(error => {
                        console.log(error);
                        // Manejo de errores en la actualización
                    });
                } else {
                    // Si no es idProducto 13, simplemente actualizar el stock seleccionado
                    const updatedCantidad = parseInt(stock.cantidad, 10) + parseInt(addCantidad, 10);
    
                    db.Stock.update({
                        cantidad: updatedCantidad
                    }, {
                        where: {
                            id: idStock
                        }
                    }).then(() => {
                        return res.redirect('/cunas/listar');
                    }).catch(error => {
                        console.log(error);
                        // Manejo de errores en la actualización
                    });
                }
            }).catch(error => {
                console.log(error);
                // Manejo de errores en la consulta del stock
            });
        } else {
            const userLogin = req.session.userLogin;

            const stock = db.Stock.findAll({ //ESTA CONSULTA ME TRAE UNA LISTA DE EL STOCK ASOCIADO A UN USUARIO Y POR ENDE A UN DESTINO
                where:{
                    idDestino:userLogin.destinoId
                },
                include:[
                    {model:db.Usuario,
                     as:'usuario',
                     attributes:{exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]},
                     include: [
                       { model: db.destinoUsuario,
                        as: 'destino',
                        attributes:{exclude:['provincia', 'ciudad', 'createdAt', 'updatedAt']}
                        }
                     ]                  
                    
                    },
                    {
                        model: db.Producto,
                        as:'producto',
                        attributes: {exclude:['detalle','createdAt', 'updatedAt' ]}
                    }
                    
                ],
                order:[
                    ['idProducto', 'DESC']
                ]
            })
    
            const cunas = db.Producto.findAll({ //ESTA CONSULTA TRAE TODOS LOS PRODUCTOS PARA MOSTRAR EN LA VISTA
                attributes:{exclude:['createdAt','updatedAt']},
                order : [['id']],
            })
    
            const user = db.Usuario.findOne({ //ESTA VISTA ME TRAE EL USUARIO
                where:{
                    id:userLogin.id
                },
                include:[{
                    model: db.destinoUsuario,
                    as:'destino',
                    attributes:{
                        exclude:["provincia", "ciudad", "createdAt", "updatedAt"]
                    }
                }],
                attributes:{
                    exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]
                }
            })
    
    
            Promise.all(([cunas, user, stock]))
            .then(([cunas, user, stock]) => {
               /*  return res.send(stock) */
                return res.render("cunas/listCunas",{
                    cunas,
                    user,
                    stock,
                    title:"Stock de Cunas",
                    old:req.body,
                    errors: errors.mapped()
                })
            })
        }      
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
            return res.render('cunas/estadistica',{
                title:'Estadisticas',
                productos,
                destinos
            })
        })
      
    },

    registroRetiros: (req,res) => {
        db.detalleRetiro.findAll({
            include:["destino", "producto"]
        })
        .then(stocks => {
          /*   return res.send(stocks) */
            return res.render('cunas/retiros',{
                title:"Retiros",
                stocks
            })  
        })      
    },

    retirarStock: (req,res) => {

        const errors = validationResult(req);

       if (errors.isEmpty()) {

        const {destino,producto,cantidad,acta} = req.body;
        const usuario = req.session.userLogin.id
        const idStock = req.params.id

        db.detalleRetiro.create({
            idDestino: destino,
            idUsuario:usuario,
            idProducto:producto,
            idStock:idStock,
            cantidadRetirada:cantidad,
            actaEntrega:acta.trim()
        })
        .then(retiroStock => {

            db.Stock.update({
                cantidad: db.Sequelize.literal(`cantidad - ${retiroStock.cantidadRetirada}`)
            },
                
            {
                where: {id:retiroStock.idStock}
            })
        })
        .then(() => {        
        
                db.Stock.update({
                    cantidad: db.Sequelize.literal(`cantidad + ${req.body.cantidad}`)
                },{
                    where: {
                        idDestino:31,
                        idProducto:req.body.producto
                    }
                })
                .then(() => {
                    return res.redirect('/cunas/retiros')
                })            
        })
        .catch(error => console.log(error))         

       } else {
        db.Stock.findAll({
            where:{idDestino:req.body.destino},
            include : [
                {
                    model: db.destinoUsuario,
                    as:'destino',
                    attributes:['id', 'nombreDestino'],
                    order:[['nombreDestino', 'ASC']]
                },
                {
                    model: db.Producto,
                    as: 'producto',
                    attributes:['id', 'nombre', 'imagen']
                }
            ],
        }).then(stocks => {
            return res.render('cunas/searchStockPorDestino',{
                title:'Resultado de la busqueda',
                stocks,
                old:req.body,
                errors:errors.mapped()
            })
        })
       }
    },

    buscarStock : (req,res) => {

        const errors = validationResult(req);

        if (errors.isEmpty()) {
            const {producto, destino} = req.body

            db.Stock.findOne({
                where:{
                    idProducto:producto,
                    idDestino:destino
                },
                include : [
                    {
                        model: db.destinoUsuario,
                        as:'destino',
                        attributes:['id', 'nombreDestino'],
                        order:[['nombreDestino', 'ASC']]
                    },
                    {
                        model: db.Producto,
                        as: 'producto',
                        attributes:['id', 'nombre', 'imagen']
                    }
                ],
              
            })
            .then(stock => {
                return res.render('cunas/searchStock',{
                    title:'Resultado de la busqueda',
                    stock
                })
            }).catch(error => console.log(error))
        } else{
            const productos = db.Producto.findAll({
                attributes: ['id', 'nombre']
            })
    
            const destinos = db.destinoUsuario.findAll({
                attributes:['id', 'nombreDestino' ]
            })
    
            Promise.all(([productos, destinos]))
            .then(([productos, destinos]) => {
                return res.render('cunas/estadistica',{
                    title:'Estadisticas',
                    productos,
                    destinos,
                    old:req.body,
                    errors:errors.mapped()
                })
            })

        }       
       
    },

    buscarStockPorDestino : (req,res) => {
        const errors = validationResult(req);

        if(errors.isEmpty()){
            db.Stock.findAll({
                where:{idDestino:req.body.destino},
                include : [
                    {
                        model: db.destinoUsuario,
                        as:'destino',
                        attributes:['id', 'nombreDestino'],
                        order:[['nombreDestino', 'ASC']]
                    },
                    {
                        model: db.Producto,
                        as: 'producto',
                        attributes:['id', 'nombre', 'imagen']
                    }
                ],
            }).then(stocks => {
                return res.render('cunas/searchStockPorDestino',{
                    title:'Resultado de la busqueda',
                    stocks
                })
            })
        } else {
            const productos = db.Producto.findAll({
                attributes: ['id', 'nombre']
            })
    
            const destinos = db.destinoUsuario.findAll({
                attributes:['id', 'nombreDestino' ]
            })
    
            Promise.all(([productos, destinos]))
            .then(([productos, destinos]) => {
                return res.render('cunas/estadistica',{
                    title:'Estadisticas',
                    productos,
                    destinos,
                    old:req.body,
                    errors:errors.mapped()
                })
            })
        }    
    },

    retirarKits: (req,res) => {

        db.Stock.findOne({
            where:{
                idProducto:13,
                idDestino:31,
                idUsuario:1
            },
            include:['destino', 'producto']
        }).then(kitStock => {
            return res.render('cunas/entregaKits',{
                title:'Entregar Kits',
                kitStock
            })
        })      
    },

    entregarKit: (req,res) => {

        const errors = validationResult(req);

        if (errors.isEmpty()) {

        const idUsuario = req.session.userLogin.id;
        const {cantidad, producto, destino, acta } = req.body    

        db.retiroKit.create({
            idUsuario: idUsuario,
            idProducto:producto,
            cantidadRetirada:cantidad,
            actaRemito:acta,
            idDestino:destino,
            idStock:5
        }).then(kitRetirado => {
        db.Stock.update({
            cantidad: db.Sequelize.literal(`cantidad - ${kitRetirado.cantidadRetirada}`)
        },
        {
            where:{
                id:5
            }
        }).then(() => {
            return res.redirect('/cunas/estadistica')
        })
       
        }).catch(error => console.log(error));
            
        } else{
            db.Stock.findOne({
                where:{
                    idProducto:13,
                    idDestino:31,
                    idUsuario:1
                },
                include:['destino', 'producto']
            }).then(kitStock => {
                return res.render('cunas/entregaKits',{
                    title:'Entregar Kits',
                    kitStock,
                    old:req.body,
                    errors:errors.mapped()
                })
            })      

        }
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
            res.setHeader('Content-Disposition', `attachment; filename="${fecha.toISOString().substring(0, 10)}-stock.xlsx"`); // agregar al nombre la fecha con New Date()
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