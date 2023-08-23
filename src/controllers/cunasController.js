const db = require("../database/models")
const {validationResult} = require('express-validator')
const { Op } = require('sequelize');


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
                    if(stock.idProducto == 14){
                         db.Stock.update({
                            cantidad: db.Sequelize.literal(`cantidad - ${stock.cantidad}`)
                        }, {
                            where: {
                                idDestino: req.session.userLogin.destinoId,
                                idProducto: { [db.Sequelize.Op.ne]: 14 }
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
                            idUsuario:userLogin.id
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
                            
                        ]
                    })  
            
    
                    const cunas = db.Producto.findAll({
                        attributes:{exclude:['createdAt','updatedAt']},
                        order : [['id']],
                    })
            
                    const user = db.Usuario.findOne({
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
                            exclude:["name", "surname", "email", "password", "icon","socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedat"]
                        }
                    })
            
            
                    Promise.all(([cunas, user, stock]))
                    .then(([cunas, user, stock]) => {
                        return res.render("cunas/listCunas",{
                            cunas,
                            stock,
                            user,
                            title:"Stock de Cunas",
                            errors:errors.mapped(),
                            old:req.body
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
                if (stock.idProducto === 14) {
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
                                idProducto: { [db.Sequelize.Op.ne]: 14 }
                            }
                        });
                    }).then(() => {
                        return res.redirect('/cunas/listar');
                    }).catch(error => {
                        console.log(error);
                        // Manejo de errores en la actualización
                    });
                } else {
                    // Si no es idProducto 14, simplemente actualizar el stock seleccionado
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
                        idUsuario:userLogin.id
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
                    /* return res.send(stock) */
                    return res.render("cunas/listCunas",{
                        cunas,
                        user,
                        stock,
                        title:"Stock de Cunas",
                        errors:errors.mapped(),
                        old:req.body
                    })
                })
        }
   
    },

    estadisticas: (req,res) => {
        return res.render('cunas/estadistica',{
            title:'Estadisticas'
        })
    }
}