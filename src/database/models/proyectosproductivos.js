'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proyectoProductivo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      proyectoProductivo.hasMany(models.Producto,{
        foreignKey:'idProyecto',
        as:'productoProyecto'
      })
    }
  }
  proyectoProductivo.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTalleres: DataTypes.INTEGER,
    cantidadAProducir: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    procedencia: DataTypes.STRING,
    duracion: DataTypes.STRING,
    unidadDuracion: DataTypes.STRING,
    costoTotal: DataTypes.INTEGER,
    costoUnitario: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'proyectoProductivo',
  });
  return proyectoProductivo;
};