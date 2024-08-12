'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class insumoProyecto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      insumoProyecto.belongsTo(models.Proyecto,{
        foreignKey:'proyectoId',
        as:'insumosProyecto',
        onDelete:'CASCADE'
      })

      insumoProyecto.belongsTo(models.Producto,{
        foreignKey:'productoId',
        as:'productoInsumos',
        onDelete: 'CASCADE'
      })

      insumoProyecto.belongsTo(models.Insumo,{
        foreignKey:'insumoId',
        as:'insumos',
        onDelete:'CASCADE'
      })


    }
  }
  insumoProyecto.init({
    cantidadAProducir: DataTypes.INTEGER,
    cantidadRequerida: DataTypes.INTEGER,
    cantidadAdquirida: DataTypes.DECIMAL(10, 2),
    detalle: DataTypes.STRING,
    proyectoId: DataTypes.INTEGER,
    productoId: DataTypes.INTEGER,
    insumoId: DataTypes.INTEGER,
    factura: DataTypes.STRING,
    decomiso: DataTypes.INTEGER,
    expedienteDecomiso: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'insumoProyecto',
  });
  return insumoProyecto;
};