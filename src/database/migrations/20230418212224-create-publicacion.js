'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Publicaciones', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      titulo: {
        type: Sequelize.STRING
      },
      expediente: {
        type: Sequelize.STRING
      },
      objetivo: {
        type: Sequelize.STRING
      },
      archivo: {
        type: Sequelize.STRING
      },
      tipoId: {
        type: Sequelize.INTEGER,
        allowNull:true,
        references: {
          model : {
            tableName:"Tipos",
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
    await queryInterface.dropTable('Publicaciones');
  }
};