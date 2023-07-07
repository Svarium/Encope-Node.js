'use strict';
const sequelizePaginate = require('sequelize-paginate')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Noticias extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Noticias.hasMany(models.Image,{
        as:'images',
        foreignKey:'noticiaId',
        onDelete:'cascade'
      })


    }
  }
  Noticias.init({
    titulo: DataTypes.STRING,
    descripcion: DataTypes.TEXT,
    video: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Noticias',
  });

  sequelizePaginate.paginate(Noticias)
  return Noticias;
};