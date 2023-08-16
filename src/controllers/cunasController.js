const db = require("../database/models")
const {validationResult} = require('express-validator')


module.exports = {
    list : (req,res) => {
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
                    attributes: {exclude:['detalle', 'imagen','createdAt', 'updatedAt' ]}
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
          /*   return res.send(stock) */
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
        

        /* return res.send(errors.mapped()) */
        

        if(errors.isEmpty()){
            const {cantidad, producto} = req.body;
            const id = req.session.userLogin.id

            db.Stock.create({
                idUsuario:id,
                idProducto:producto,
                cantidad:cantidad
            })
            .then(stock => {
                return res.redirect('/cunas/listar')
            })
            .catch(error => console.log(error))

            } else {
                const userLogin = req.session.userLogin;

        

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
        
        
                Promise.all(([cunas, user]))
                .then(([cunas, user]) => {
                    return res.render("cunas/listCunas",{
                        cunas,
                        user,
                        title:"Stock de Cunas",
                        errors:errors.mapped(),
                        old:req.body
                    })
                })       



            }
    }
}