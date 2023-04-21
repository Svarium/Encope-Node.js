'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Rols extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      
      Rols.hasMany(models.Usuario,{
        as:"usuarios",
        foreignKey:"rolId",
        onDelete:"CASCADE"
      })
    }
  }
  Rols.init({
    nombre: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Rols',
  });
  return Rols;
};