const { where } = require('sequelize');
const db = require('../database/models');

module.exports = {


  editProyectState : async (data) => {
      try {
        const proyecto = await db.Proyecto.findByPk(data); // Busca el proyecto por su ID

        // Verifica el estado actual y actualíza en consecuencia
        if (proyecto.estado === "Pendiente") {
          proyecto.estado = "Finalizado"; // Si está Pendiente, cámbia a Finalizado
        } else if (proyecto.estado === "Finalizado") {
          proyecto.estado = "Pendiente"; // Si está Finalizado, cámbia a Pendiente
        }
    
        await proyecto.save(); // Guarda los cambios en la base de datos
    
        return proyecto;
      } catch (error) {
        console.log(error);
        throw{
            status:500,
            message:error.message,
        }        
      }
  },

  editParteSemanal : async (id, data) => {

    try {

      const parteUpdated = await db.Parte.update({
        remanentes:data.trim()
      },
      {
        where:{
          id:id
        }
      }
      )

      return parteUpdated
      
    } catch (error) {
      console.log(error);
        throw{
            status:500,
            message:error.message,
        }        
    }

  },

  getAllProducts : async () => {
    try {

      const countProducts = await db.Producto.count()

      return countProducts
      
    } catch (error) {
      console.log(error);
        throw{
            status:500,
            message:error.message,
        }        
    }
  },

  getAllTallers : async () => {
    try {

      const countTallers = await db.Taller.count()
      return countTallers
      
    } catch (error) {
      console.log(error);
      throw{
          status:500,
          message:error.message,
      }        
    }
  },

  getProyectsDone : async () => {
      try {

        const proyectsDone = await db.Proyecto.count({where:{estado:"Finalizado"}})

        return proyectsDone
        
      } catch (error) {
        console.log(error);
        throw{
            status:500,
            message:error.message,
        }     
      }
  },
  
  getLastproyects : async () => {
    try {

      const lastProyects = await db.Proyecto.findAll({
        order:[["createdAt", "DESC"]],
        limit:9
      })

      return lastProyects
      
    } catch (error) {
      console.log(error);
        throw{
            status:500,
            message:error.message,
        }     
    }
  },

  editarCantidadAProducir: async (proyectoId, productoId, cantidad) => {
    try {     

      const producto = await db.proyectoProducto.findOne({where:{productoId: productoId, //busco el producto para obtener sus datos previos
        proyectoId: proyectoId,}});

      const updateProduct = await db.proyectoProducto.update({ //hago el update de las nuevas cantidades para el producto
        cantidadAProducir: cantidad,
        costoTotal: producto.costoUnitario * cantidad
      },
        {
          where: {            
            proyectoId: proyectoId,  
            productoId: productoId,                    
          }
        });

      const productos = await db.proyectoProducto.findAll( //busco todos los productos para calcular el costo total
        { where: { proyectoId: proyectoId },
          attributes:["costoUnitario", "cantidadAProducir"]
      });
      

      const costoTotal = productos.reduce((total, producto) => { //calculo el costo total del proyecto que es la suma de todos los costos totales de los producto
        
        const costoUnitario = parseFloat(producto.dataValues.costoUnitario) || 0;
        const cantidad = parseFloat(producto.dataValues.cantidadAProducir) || 0; 
    
        const costoProducto = costoUnitario * cantidad;
        return total + costoProducto;
    }, 0);

  

      const updateCostoTotalProyecto = await db.Proyecto.update({ // actualizo el costo total en la tabla proyectos
        costoTotalProyecto: costoTotal
      }, {
        where: { id: proyectoId }
      })

      return true;

    } catch (error) {
      console.log(error);
      throw {
        status: 500,
        message: error.message,
      }
    }
  },

  editarCostoUnitario : async (proyectoId, productoId, costo) => {
    try {

      const producto = await db.proyectoProducto.findOne({where:{productoId: productoId, //busco el producto para obtener sus datos previos
        proyectoId: proyectoId,}});

        const updateProduct = await db.proyectoProducto.update({ //hago el update de los nuevos costos para el producto
          costoUnitario: costo,
          costoTotal: producto.cantidadAProducir * costo
        },
          {
            where: {            
              proyectoId: proyectoId,  
              productoId: productoId,                    
            }
          });  

          const productos = await db.proyectoProducto.findAll( //busco todos los productos para calcular el costo total
          { where: { proyectoId: proyectoId },
            attributes:["costoUnitario", "cantidadAProducir"]
        });

          const costoTotal = productos.reduce((total, producto) => { //calculo el costo total del proyecto que es la suma de todos los costos totales de los producto     
            const costoUnitario = parseFloat(producto.dataValues.costoUnitario) || 0;
            const cantidad = parseFloat(producto.dataValues.cantidadAProducir) || 0; 
        
            const costoProducto = costoUnitario * cantidad;
            return total + costoProducto;
        }, 0);


      const updateCostoTotalProyecto = await db.Proyecto.update({ // actualizo el costo total en la tabla proyectos
        costoTotalProyecto: costoTotal
      }, {
        where: { id: proyectoId }
      })

      return true;
            
    } catch (error) {
      console.log(error);
      throw {
        status: 500,
        message: error.message,
      }
    }
  },


  eliminarProductoDelProyecto : async (proyectoId, productoId) => {
    try {

      const deleteProduct = await db.proyectoProducto.destroy({ //elimino el registro del producto
        where:{ proyectoId: proyectoId,  
          productoId: productoId,    }
      });    


  const productos = await db.proyectoProducto.findAll( //busco todos los productos para calcular el costo total
          { where: { proyectoId: proyectoId },
            attributes:["costoUnitario", "cantidadAProducir"]
        });

          const costoTotal = productos.reduce((total, producto) => { //calculo el costo total del proyecto que es la suma de todos los costos totales de los producto     
            const costoUnitario = parseFloat(producto.dataValues.costoUnitario) || 0;
            const cantidad = parseFloat(producto.dataValues.cantidadAProducir) || 0; 
        
            const costoProducto = costoUnitario * cantidad;
            return total + costoProducto;
        }, 0);


      const updateCostoTotalProyecto = await db.Proyecto.update({ // actualizo el costo total en la tabla proyectos
        costoTotalProyecto: costoTotal
      }, {
        where: { id: proyectoId }
      })

      return true;
      
    } catch (error) {
      console.log(error);
      throw {
        status: 500,
        message: error.message,
      }
    }
  }

}