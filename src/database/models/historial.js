'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

    Historial.belongsTo(models.Taller,{
      foreignKey:'idTaller',
      as:"historialTaller",
      onDelete:'CASCADE'
    })  

    Historial.belongsTo(models.Proyecto,{
      foreignKey:'idProyecto',
      as:'historialProyecto',
      onDelete:'CASCADE'
    }) 

    
    }
    

  }
  Historial.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTaller: DataTypes.INTEGER,
    detalle: DataTypes.STRING,  
    procedencia: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    unidadDuracion: DataTypes.STRING, 
    costoTotalProyecto: DataTypes.INTEGER, 
    idProyecto: DataTypes.INTEGER,   
    insumos:DataTypes.STRING,
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
    modelName: 'Historial',
  });
  return Historial;
};