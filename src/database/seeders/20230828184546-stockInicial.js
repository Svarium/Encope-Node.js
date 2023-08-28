'use strict';

let stocks = require("../../data/stock.json")

let stockInicial = stocks.map(stock => {
  let stockInicial = {
    idUsuario: stock.idUsuario,
    idProducto: stock.idProducto,
    idDestino: stock.idDestino,
    cantidad: stock.cantidad,
    createdAt: new Date,
    updatedAt: new Date
  }

  return stockInicial

})

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert("Stocks", stockInicial, {})
  },

  async down (queryInterface, Sequelize) {
   await queryInterface.bulkDelete("Stocks", null, {})
  }
};
