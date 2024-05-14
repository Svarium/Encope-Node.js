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

      Insumo.hasMany(models.productoInsumo,{
        foreignKey:'idInsumo',
        as:'insumos'
      })

    }
  }
  Insumo.init({
    nombre: DataTypes.STRING,
    cantidad: DataTypes.STRING,
    detalle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Insumo',
  });
  return Insumo;
};