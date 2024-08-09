'use strict';
require("dotenv").config();


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('Usuarios', [{
        name: process.env.USER_ADMIN_NAME,
        surname : process.env.USER_ADMIN_SURNAME,
        email : process.env.USER_ADMIN_EMAIL,      
        icon : 'https://images.pexels.com/photos/2473183/pexels-photo-2473183.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',     
        destinoId: process.env.USER_ADMIN_DESTINO,
        credencial: process.env.USER_ADMIN_CREDENCIAL,
        rolId: process.env.USER_ADMIN_ROL, 
        password:process.env.USER_ADMIN_PASSWORD,     
        createdAt: new Date,  
        updatedAt: new Date
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Usuarios', null, {});
     
  }
};
