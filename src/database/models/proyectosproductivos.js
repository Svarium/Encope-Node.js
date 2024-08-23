'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Proyecto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

 
      Proyecto.hasMany(models.Parte,{
        foreignKey:'idProyecto',
        as:'parteProyecto'
      })  
      
      Proyecto.hasMany(models.proyectoProducto,{
        foreignKey:'proyectoId',
        as:'productoProyecto'
      }) 

      Proyecto.hasMany(models.insumoProyecto,{
        foreignKey:'proyectoId',
        as:'insumosProyecto',
        onDelete:'CASCADE'
      })
  

      Proyecto.belongsTo(models.Taller,{
        foreignKey:'idTaller',
        as:'proyectoTaller',
        onDelete:'CASCADE'
      })

      Proyecto.hasMany(models.Historial,{
        foreignKey:'idProyecto',
        as:'historialProyecto',
        onDelete:'CASCADE'
      })


    }
  }
  Proyecto.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTaller: DataTypes.INTEGER, 
    detalle: DataTypes.STRING,
    procedencia: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    unidadDuracion:{
      type: DataTypes.STRING,
      defaultValue:"pendiente",
      validate:{
        isIn:{
          args: [["dia", "semana", "mes"]],
          msg:"Llas duraciones válidas son dia - semana  - mes"
        },
      },
    },
    costoTotalProyecto: DataTypes.INTEGER,    
    insumosAdquirir:DataTypes.STRING,
    estado:{
      type: DataTypes.STRING,
      defaultValue:"pendiente",
      validate:{
        isIn:{
          args: [["Pendiente", "Finalizado"]],
          msg:"Los estados validos son Pendiente y Finalizado"
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Proyecto',
  });
  return Proyecto;
};