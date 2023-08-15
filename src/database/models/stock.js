'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Stock extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Stock.belongsTo(models.Usuario,{
        foreignKey:'idUsuario',
        as:'usuario'
      });

      Stock.belongsTo(models.Producto,{
        foreignKey: 'idProducto',
        as:'producto'
      });
    }
  }
  Stock.init({
    idUsuario: DataTypes.INTEGER,
    idProducto: DataTypes.INTEGER,
    cantidad: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Stock',
  });
  return Stock;
};