'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Parte extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Parte.belongsTo(models.Proyecto,{
        foreignKey:'idProyecto',
        as:'parteProyecto',
        onDelete:'CASCADE'
      })
  

      Parte.belongsTo(models.Taller,{
        foreignKey:'idTaller',
        as:'parteTaller',
        onDelete:'CASCADE'
      })

      Parte.belongsTo(models.Ficha,{
        foreignKey:'idFicha',
        as:'parteFicha',
        onDelete:'CASCADE'
      })

     
    }
  }
  Parte.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTaller: DataTypes.INTEGER,
    detalle: DataTypes.STRING,    
    procedencia: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    unidadDuracion: DataTypes.STRING,       
    idProyecto: DataTypes.INTEGER,
    idFicha: DataTypes.INTEGER,   
    observaciones: DataTypes.STRING,
    remanentes: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parte',
  });
  return Parte;
};