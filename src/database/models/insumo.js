'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Insumo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

     Insumo.belongsTo(models.Producto,{
      foreignKey:"idProducto",
      as:"productos"
     })

     Insumo.hasMany(models.insumoProyecto,{
      foreignKey:'insumoId',
      as:'insumos',
      onDelete:'CASCADE'
     })

    }
  }
  Insumo.init({
    nombre: DataTypes.STRING,
    unidadDeMedida: DataTypes.STRING,
    cantidad: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    idProducto: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Insumo',
  });
  return Insumo;
};