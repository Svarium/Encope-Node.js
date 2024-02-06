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
        has:'parteProyecto'
      })
    }
  }
  Parte.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTaller: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    cantidadAProducir: DataTypes.INTEGER,
    procedencia: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    unidadDuracion: DataTypes.STRING,
    costoTotal: DataTypes.INTEGER,
    costoUnitario: DataTypes.INTEGER,
    idProducto: DataTypes.INTEGER,
    idProyecto: DataTypes.INTEGER,
    cantidadProducida: DataTypes.INTEGER,
    restanteAProducir: DataTypes.INTEGER,
    egresos: DataTypes.INTEGER,
    observaciones: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Parte',
  });
  return Parte;
};