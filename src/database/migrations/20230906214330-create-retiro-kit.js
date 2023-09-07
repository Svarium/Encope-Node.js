'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('retiroKits', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      idUsuario: {
        type: Sequelize.INTEGER,
        references:{
          model:'Usuarios',
          key:'id'
        },
        allowNull:false,
      },
      idProducto: {
        type: Sequelize.INTEGER,
        references:{
          model:'Productos',
          key:'id'
        },
        allowNull:false,
      },
      cantidadRetirada: {
        type: Sequelize.INTEGER
      },
      actaRemito: {
        type: Sequelize.STRING
      },
      idDestino: {
        type: Sequelize.INTEGER,
        references:{
          model:'destinoUsuarios',
          key:'id',
        },
        allowNull:false,
      },
      idStock: {
        type: Sequelize.INTEGER,
        references:{
          model:'Stocks',
          key:'id'
        },
        allowNull:false
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
    await queryInterface.dropTable('retiroKits');
  }
};