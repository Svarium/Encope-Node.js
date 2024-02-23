'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Partes', {
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
      detalle: {
        type: Sequelize.STRING
      },
      cantidadAProducir: {
        type: Sequelize.INTEGER
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
      costoTotal: {
        type: Sequelize.INTEGER
      },
      costoUnitario: {
        type: Sequelize.INTEGER
      },
      idProducto: {
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
      idProyecto: {
        type: Sequelize.INTEGER,
        references: {
          model:{
            tableName:"Proyectos"
          },
          key:"id"
        }
      },
      cantidadProducida: {
        allowNull:true,
        type: Sequelize.INTEGER
      },
      restanteAProducir: {
        type: Sequelize.INTEGER
      },
      stockEnTaller: {
        type: Sequelize.INTEGER
      },
      egresos: {
        allowNull:true,
        type: Sequelize.INTEGER
      },
      observaciones: {
        allowNull:true,
        type: Sequelize.STRING
      },
      remanentes : {
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
    await queryInterface.dropTable('Partes');
  }
};