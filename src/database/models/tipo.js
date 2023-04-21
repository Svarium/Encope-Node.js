'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tipos extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Tipos.hasMany(models.Publicaciones,{
        as: "publicaciones",
        foreignKey: "tipoId",
        onDelete:"CASCADE"
      })
    }
  }
  Tipos.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Tipos',
  });
  return Tipos;
};