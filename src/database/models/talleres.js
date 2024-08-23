'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Taller extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here

      Taller.belongsTo(models.destinoUsuario,{
        foreignKey: 'idDestino',
        as: 'destinoTaller'
      })

      Taller.hasMany(models.Proyecto,{
        foreignKey:'idTaller',
        as:'proyectoTaller'
      })

      Taller.hasMany(models.Historial,{
        foreignKey:'idTaller',
        as:'historialTaller'
      })

      Taller.hasMany(models.Parte,{
        foreignKey:'idTaller',
        as:'parteTaller'
      })
    }
  }
  Taller.init({
    nombre: DataTypes.STRING,
    expediente: DataTypes.STRING,
    idDestino: DataTypes.INTEGER,
    detalle: DataTypes.STRING,
    estado:{
      type: DataTypes.STRING,
      defaultValue:"En Proceso de Aprobación",
      validate:{
        isIn:{
          args: [["Aprobado", "De Baja", "En Proceso de Aprobación"]],
          msg:"Los estados validos son Pendiente y Finalizado"
        },
      },
    },
    observaciones:DataTypes.STRING,
  }, {
    sequelize,
    modelName: 'Taller',
  });
  return Taller;
};