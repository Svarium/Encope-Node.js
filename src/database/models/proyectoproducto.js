'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class proyectoProducto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      proyectoProducto.belongsTo(models.Proyecto,{
        foreignKey:'proyectoId',
        as:'productoProyecto',
        onDelete:'CASCADE'
      })

      proyectoProducto.belongsTo(models.Parte,{
        foreignKey:'parteId',
        as:'productoParte',
        onDelete:'CASCADE'
      })

      proyectoProducto.belongsTo(models.Producto,{
        foreignKey:'productoId',
        as:'producto',
        onDelete:'CASCADE'
      })

     
    }
  }
  proyectoProducto.init({
    proyectoId: DataTypes.INTEGER,
    parteId: DataTypes.INTEGER,
    productoId: DataTypes.INTEGER,   
    cantidadAProducir: DataTypes.INTEGER,
    costoUnitario: DataTypes.INTEGER,
    costoTotal: DataTypes.INTEGER,
    cantidadProducida: DataTypes.INTEGER,
    restanteAProducir: DataTypes.INTEGER,
    stockEnTaller: DataTypes.INTEGER,
    egresos: DataTypes.INTEGER,
  }, {
    sequelize,
    modelName: 'proyectoProducto',
  });
  return proyectoProducto;
};