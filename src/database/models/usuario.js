'use strict';
const sequelizePaginate = require('sequelize-paginate')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Usuario.belongsTo(models.Rols,{
        foreignKey : 'rolId',
        as : 'rol'
      })

      
      Usuario.belongsTo(models.destinoUsuario,{
        foreignKey : 'destinoId',
        as : 'destino'
      })

      Usuario.hasMany(models.Stock,{
        foreignKey:'idUsuario',
        as:'stock'
      })
    }  

  }
  Usuario.init({
    name: DataTypes.STRING,
    surname: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    icon: DataTypes.STRING,
    socialId: DataTypes.STRING,
    socialProvider: DataTypes.STRING,
    rolId: {type:DataTypes.INTEGER, defaultValue:6},
    destinoId: DataTypes.INTEGER,
    credencial: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Usuario',
  });

  sequelizePaginate.paginate(Usuario)
  return Usuario;
};