const db = require('../database/models');

module.exports = {

    getAllKits : async () => {
        try {

            const kitsDone = await db.Stock.findAll({
                where:{
                    idProducto:14
                },
                attributes:{exclude:['id','idUsuario']}
            })

            return kitsDone
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
        }
    },

    getAllStocks : async () => {
        try {
            const usersWithDestino31 = await db.Usuario.findAll({
              where: {
                destinoId: 31
              }
            });
        
            const userIds = usersWithDestino31.map(user => user.id);
        
            const stockDestino = await db.Stock.findAll({
              where: {
                idUsuario: userIds
              },
              include: [
                {
                  model: db.Usuario,
                  as: 'usuario',
                  attributes: {
                    exclude: ["name", "surname", "email", "password", "icon", "socialId", "socialProvider", "rolId", "credencial", "createdAt", "updatedAt"]
                  },
                  include: [
                    {
                      model: db.destinoUsuario,
                      as: 'destino',
                      attributes: { exclude: ['provincia', 'ciudad', 'createdAt', 'updatedAt'] }
                    }
                  ]
                },
                {
                  model: db.Producto,
                  as: 'producto',
                  attributes: { exclude: ['detalle', 'createdAt', 'updatedAt' ]}
                }
              ]
            });
        
            return stockDestino;
            
        } catch (error) {
            console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
        }
    },

    getAllProducts: async () => {
      try {
      const allProducts =  db.Producto.findAll({
          attributes:{exclude:["id", "imagen", "createdAt", "updatedAt"]}
        })

        return allProducts
        
      } catch (error) {
        console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
      }
    },

    getAllEditors: async () => {
      try {

        const allEditors = db.Usuario.findAll({
          where: { rolId: 5 },
      attributes: {
        exclude: ["id", "name", "surname", "password", "icon", "socialId", "createdAt", "updatedAt","socialProvider"],
      },
        }
        )

        return allEditors

      } catch (error) {
        console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
      }
    },

    getGeneralStock: async () => {
      try {

        const generalStock = await db.Stock.findAll({
          include:["destino", "producto"]
        })

        return generalStock
        
      } catch (error) {
        console.log(error);
            throw{
                status:500,
                message:error.message,
            }        
      }
    },

    validarCantidad: async(data) => {
      try {

        const stocks = await db.Stock.findAll()

        const cantidades = stocks.map(item => item.cantidad)

        const isValid = cantidades.every(cantidad => data <= cantidad)

        return !isValid ? false : true
        
      } catch (error) {
        console.log(error);
        throw{
            status:500,
            message:error.message,
        }       
      }
    }



}