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
      cantidadTotal: {
        type: Sequelize.INTEGER
      },
      detalle: {
        type: Sequelize.STRING
      },
      procedencia: {
        type: Sequelize.STRING
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      unidadDuracion: {
        type: Sequelize.STRING
      },
      costoTotalProyecto: {
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
      idFicha:{
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: "Fichas"
          },
          key:"id"
        }
      },
      insumos: {
        type: Sequelize.STRING
      },
      estado: {
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
    await queryInterface.dropTable('Proyectos');
  }
};