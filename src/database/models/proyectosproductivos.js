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
    }
  }
  Proyecto.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTaller: DataTypes.INTEGER,
    cantidadAProducir: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    procedencia: DataTypes.STRING,
    duracion: DataTypes.STRING,
    unidadDuracion: DataTypes.STRING,
    costoTotal: DataTypes.INTEGER,
    costoUnitario: DataTypes.INTEGER,
    idProducto: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Proyecto',
  });
  return Proyecto;
};