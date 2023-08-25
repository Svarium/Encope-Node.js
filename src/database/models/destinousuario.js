'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class destinoUsuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      destinoUsuario.hasMany(models.Usuario,{
        as:"destino",
        foreignKey:"destinoId",
        onDelete:"CASCADE"
      })

      destinoUsuario.hasMany(models.Stock,{
        foreignKey:'idDestino',
        as:'destinoStock'
      })

      destinoUsuario.hasMany(models.detalleRetiro,{
        foreignKey:'idDestino',
        as:'retiro'
      })
    }


  }
  destinoUsuario.init({
    nombreDestino: DataTypes.STRING,
    provincia:DataTypes.STRING,
    ciudad:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'destinoUsuario',
  });
  return destinoUsuario;
};