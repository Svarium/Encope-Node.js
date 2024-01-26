'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Proyectos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombre: {
        type: Sequelize.STRING
      },
      expediente: {
        type: Sequelize.STRING
      },
      idTaller: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references: {
          model:{
            tableName:"Tallers"
          },
          key:"id"
        }
      },      
      cantidadAProducir: {
        type: Sequelize.INTEGER
      },
      detalle: {
        type: Sequelize.STRING
      },
      procedencia: {
        type: Sequelize.STRING
      },
      duracion: {
        type: Sequelize.STRING
      },
      unidadDuracion: {
        type: Sequelize.STRING
      },
      costoTotal: {
        type: Sequelize.INTEGER
      },
      costoUnitario: {
        type: Sequelize.INTEGER
      },
      idProducto:{
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Productos"
          },
          key:"id"
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Proyectos');
  }
};