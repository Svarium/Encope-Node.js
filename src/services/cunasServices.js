const db = require('../database/models');

module.exports = {

    getAllKits : async () => {
        try {

            const kitsDone = await db.Stock.findAll({
                where:{
                    idProducto:13
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
        
            const stockDestino = await db.Stock.findAll({
              where: {
                idDestino: 31
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

    getAllKitsOuts: async () => {
      try {

        const kitsEntregados = db.retiroKit.findAll({       
      attributes: ["cantidadRetirada"],
        }
        )

        return kitsEntregados

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
    },

    chequearCantidadRetirada: async(data, idProducto, idDestino) => {

      try {

        const stock = await db.Stock.findOne({
          where: {
            idDestino:idDestino,
            idProducto:idProducto,
          }
        })      

        if(stock.cantidad < data){
          return false
        } else {
          return true
        }
        
      } catch (error) {
        console.log(error);
        throw{
            status:500,
            message:error.message,
        }       
      }

    },

    obtenerUltimosRetiros : async (data) => {
        try {
          const retiros = await db.detalleRetiro.findAll({
            where:{idDestino:data},
            include:[{
              model: db.Producto,
              as:"producto",
              attributes:["nombre"]
            }]
          },
          
          )

          return retiros
        } catch (error) {
          console.log(error);
          throw{
              status:500,
              message:error.message,
          }       
        }
    }

}