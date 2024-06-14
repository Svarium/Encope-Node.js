'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('insumoProyectos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      cantidadRequerida: {
        type: Sequelize.INTEGER
      },
      cantidadAdquirida: {
        type: Sequelize.INTEGER
      },
      detalle: {
        type: Sequelize.STRING
      },
      proyectoId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Proyectos',
          key:'id'
        },
        allowNull:false
      },
      productoId: {
        type: Sequelize.INTEGER,
        references: {
          model:'Productos',
          key:'id'
        },
        allowNull:false
      },
      insumoId: {
        type: Sequelize.INTEGER,
        references:{
          model:'Insumos',
          key:'id'
        },
        allowNull:false
      },
      factura: {
        type: Sequelize.STRING
      },
      decomiso: {
        type: Sequelize.INTEGER
      },
      expedienteDecomiso: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('insumoProyectos');
  }
};