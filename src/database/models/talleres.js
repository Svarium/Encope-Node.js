'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Taller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Taller.belongsTo(models.destinoUsuario,{
        foreignKey: 'idDestino',
        as: 'destinoTaller'
      })

      Taller.hasMany(models.proyectoProductivo,{
        foreignKey:'idTaller',
        as:'proyectoTaller'
      })
    }
  }
  Taller.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idDestino: DataTypes.INTEGER,
    detalle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Taller',
  });
  return Taller;
};