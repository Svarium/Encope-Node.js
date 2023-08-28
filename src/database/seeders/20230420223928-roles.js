'use strict';


let listadoRoles = [
  "SuperAdmin",
  "Admin",
  "Editor-Noticias",
  "Editor-Licitaciones",
  "Editor-Intranet",
  "Editor-Cunas",
  "Visitante"
]

let roles = listadoRoles.map(rol=>{
  let rols = {
    nombre : rol,
    createdAt: new Date,  
    updatedAt: new Date
  }

  return rols
})


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
     await queryInterface.bulkInsert('Rols', roles, {});
  
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Rols', null, {});
    
  }
};
