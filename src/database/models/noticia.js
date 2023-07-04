'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Noticia extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Noticia.hasMany(models.Image,{
        as:'images',
        foreignKey:'noticiaId',
        onDelete:'cascade'
      })


    }
  }
  Noticia.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.STRING,
    video: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Noticia',
  });
  return Noticia;
};