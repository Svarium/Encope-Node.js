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
   

}