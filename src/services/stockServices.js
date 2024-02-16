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
  }

}