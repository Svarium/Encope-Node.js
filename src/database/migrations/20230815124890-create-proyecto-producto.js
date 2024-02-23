'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('proyectoProductos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      proyectoId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Proyectos',
          key:'id'
        },
        allowNull:false,
      },
      productoId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Productos',
          key:'id'
        },
        allowNull:false,
      },
      historialId:{
        type: Sequelize.INTEGER,
        references:{
          model:'Historials',
          key:'id'
        },
        allowNull:false
      },
      parteId:{
        type: Sequelize.INTEGER,
        references:{
          model:'Partes',
          key:'id'
        },
        allowNull:false
      },
      cantidadAProducir: {
        type: Sequelize.INTEGER
      },
      costoUnitario: {
        type: Sequelize.INTEGER
      },
      costoTotal: {
        type: Sequelize.INTEGER
      },
      cantidadProducida:{
        type: Sequelize.INTEGER
      },
      restanteAProducir:{
        type: Sequelize.INTEGER
      },
      stockEnTaller:{
        type: Sequelize.INTEGER
      },
      egresos:{
        type: Sequelize.INTEGER
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
    await queryInterface.dropTable('proyectoProductos');
  }
};