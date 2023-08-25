'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class detalleRetiro extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

     detalleRetiro.belongsTo(models.Usuario,{
        foreignKey:'idUsuario',
        as:'usuario'
      });

     detalleRetiro.belongsTo(models.destinoUsuario,{
        foreignKey:'idDestino',
        as:'destino'
      });

     detalleRetiro.belongsTo(models.Producto,{
        foreignKey: 'idProducto',
        as:'producto'
      });

      detalleRetiro.belongsTo(models.Stock,{
        foreignKey: 'idStock',
        as:'stock'
      });
    }
  }
  detalleRetiro.init({
    idDestino: DataTypes.INTEGER,
    idUsuario: DataTypes.INTEGER,
    idProducto: DataTypes.INTEGER,
    idStock: DataTypes.INTEGER,
    cantidadRetirada: DataTypes.INTEGER,
    actaEntrega:DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'detalleRetiro',
  });
  return detalleRetiro;
};