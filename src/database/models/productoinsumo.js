'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class productoInsumo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      productoInsumo.belongsTo(models.Producto,{
        foreignKey:'idProducto',
        as:'productos'
      });

      productoInsumo.belongsTo(models.Insumo,{
        foreignKey:'idInsumo',
        as:'insumos'
      });

    }
  }
  productoInsumo.init({
    idProducto: DataTypes.INTEGER,
    idInsumo: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'productoInsumo',
  });
  return productoInsumo;
};