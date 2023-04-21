'use strict';


let listadoDeTipos = [
  "Licitación Pública",
  "Licitación Privada",
  "Contratación Directa",
  "Adjudicación",
  "Circular Modificatoria",
  "Dictamen de Evaluación",
  "Compulsa Urgente"
]

let tipos = listadoDeTipos.map(tipo => {
  let licitacion = {
    nombre : tipo,
    createdAt: new Date,  
    updatedAt: new Date
  }

  return licitacion
})





/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   
      await queryInterface.bulkInsert('Tipos', tipos , {});
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Tipos', null, {});
     
  }
};
