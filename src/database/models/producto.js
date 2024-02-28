'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Producto extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here


      Producto.hasMany(models.proyectoProducto, {
        foreignKey: 'productoId',
        as: 'producto',
        onDelete: 'CASCADE'
      });
    
    }
  }
  Producto.init({
    nombre: DataTypes.STRING,
    detalle: DataTypes.STRING,
    imagen: DataTypes.STRING,   
    unidadDeMedida:DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Producto',
  });
  return Producto;
};