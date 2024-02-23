'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Ficha extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Ficha.hasMany(models.Proyecto,{
        foreignKey:'idFicha',
        as:'proyectoFicha'
      })

      Ficha.hasMany(models.Historial,{
        foreignKey:'idFicha',
        as:'historialFicha'
      })

      Ficha.hasMany(models.Parte,{
        foreignKey:'idFicha',
        as:'parteFicha'
      })
    }
  }
  Ficha.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    archivo: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Ficha',
  });
  return Ficha;
};