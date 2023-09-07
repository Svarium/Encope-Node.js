'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class retiroKit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      retiroKit.belongsTo(models.Usuario,{
        foreignKey:'idUsuario',
        as:'usuario'
      });

      retiroKit.belongsTo(models.Producto,{
        foreignKey:'idProducto',
        as:'producto'
      });

      retiroKit.belongsTo(models.destinoUsuario,{
        foreignKey:'idProducto',
        as:'destino'
      });

      retiroKit.belongsTo(models.Stock,{
        foreignKey:'idStock',
        as:'stock'
      });


    }
  }
  retiroKit.init({
    idUsuario: DataTypes.INTEGER,
    idProducto: DataTypes.INTEGER,
    cantidadRetirada: DataTypes.INTEGER,
    actaRemito: DataTypes.STRING,
    idDestino: DataTypes.INTEGER,
    idStock: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'retiroKit',
  });
  return retiroKit;
};