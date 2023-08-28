'use strict';



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('Usuarios', [{
        name: 'Ezequiel',
        surname : 'Muñoz',
        email : 'EzeMunoz@gmail.com',
        password : '$2b$10$XxaRcb63amBM6nwDp3glMO7lQpNcerGAIJlXf09dFKif51JbbPah2',
        icon : '1680639888293_icons_.jpg',
        rolId: 1, 
        destinoId:31,     
        createdAt: new Date,  
        updatedAt: new Date
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Usuarios', null, {});
     
  }
};
