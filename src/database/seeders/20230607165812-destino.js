'use strict';

let destinos = require("../../data/unidades.json")

let destinoUsuario = destinos.map(destino => {
  let destinoUsuarios = {
    nombreDestino: destino.nombreDestino,
    provincia: destino.provincia,
    ciudad:destino.ciudad,
    createdAt: new Date,
    updatedAt: new Date
  }
  return destinoUsuarios
}) 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert("destinoUsuarios", destinoUsuario, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete("destinoUsuarios", null, {})
  }
};
