'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Tallers', {
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
      idDestino: {
        type: Sequelize.INTEGER,
        allowNull:false,
        references:{
          model: {
            tableName:"destinoUsuarios"
          },
          key:"id"
        }
      },
      detalle: {
        type: Sequelize.STRING
      },
      estado:{
        type: Sequelize.STRING,
        allowNull:false
      },
      observaciones:{
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
    await queryInterface.dropTable('Tallers');
  }
};