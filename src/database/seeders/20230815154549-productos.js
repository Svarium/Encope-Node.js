'use strict';

let productos = require("../../data/cunitas.json")

let productosCuna = productos.map(producto => {
  let productosCuna = {
    nombre: producto.nombre,
    detalle:producto.detalle,
    imagen:producto.imagen,
    createdAt: new Date,
    updatedAt: new Date
  }

  return productosCuna
})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.bulkInsert("Productos",
   productosCuna, {})
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete("Productos",
   null, {})
  }
};
