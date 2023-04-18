'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Publicaciones extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Publicaciones.belongsTo(models.Tipos,{
        as:"tipo",
        foreignKey: "tipoId"
      })

    }
  }
  Publicaciones.init({
    titulo: DataTypes.STRING,
    expediente: DataTypes.STRING,
    objetivo: DataTypes.STRING,
    fecha: DataTypes.DATE,
    archivo: DataTypes.STRING,
    tipoId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Publicaciones',
  });
  return Publicaciones;
};