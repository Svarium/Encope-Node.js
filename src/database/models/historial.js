'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Historial extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Historial.belongsTo(models.Proyecto,{
        foreignKey:'idProyecto',
        has:'historialProyecto',
        onDelete:'CASCADE'
      })


      Historial.belongsTo(models.Producto,{ //editar relacion 
        foreignKey:'idProducto',
        as:'historialProducto',
        onDelete:'CASCADE'
      })

      Historial.belongsTo(models.Taller,{
        foreignKey:'idTaller',
        as:'historialTaller',
        onDelete:'CASCADE'
      })

      Historial.belongsTo(models.Ficha,{
        foreignKey:'idFicha',
        as:'historialFicha',
        onDelete:'CASCADE'
      })


      Historial.hasMany(models.proyectoProducto,{
        foreignKey:'historialId',
        has:'historial'
      }) 
    }
    

  }
  Historial.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idTaller: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    cantidadTotal: DataTypes.INTEGER,
    procedencia: DataTypes.STRING,
    duracion: DataTypes.INTEGER,
    unidadDuracion: DataTypes.STRING, 
    costoTotalProyecto: DataTypes.INTEGER,   
    idProducto: DataTypes.INTEGER,
    idProyecto: DataTypes.INTEGER,
    idFicha: DataTypes.INTEGER,
    insumos:DataTypes.STRING,
    estado:{
      type: DataTypes.STRING,
      defaultValue:"pendiente",
      validate:{
        isIn:{
          args: [["Pendiente", "Finalizado"]],
          msg:"Los estados validos son Pendiente y Finalizado"
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Historial',
  });
  return Historial;
};