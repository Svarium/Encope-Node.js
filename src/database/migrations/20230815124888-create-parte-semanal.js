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
      procedencia: {
        type: Sequelize.STRING
      },
      duracion: {
        type: Sequelize.INTEGER
      },
      unidadDuracion: {
        type: Sequelize.STRING
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
      observaciones: {
        allowNull:true,
        type: Sequelize.TEXT
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