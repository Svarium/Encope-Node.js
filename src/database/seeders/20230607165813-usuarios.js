'use strict';
require("dotenv").config();


/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
<<<<<<< HEAD
      await queryInterface.bulkInsert('Usuarios', [
        {
          name: 'Ezequiel',
          surname : 'Muñoz',
          email : 'svariumfoo@gmail.com',      
          icon : 'https://lh3.googleusercontent.com/a/ACg8ocKAyV2iuOjK40tmmIlfcXKT9gOj4b1xdDkTG9Xz-NQXce4=s96-c',
          socialId: '117303958612759707634',
          socialProvider:'google',
          destinoId:1,
          credencial: 42942,
          rolId: 1, 
          destinoId:1,     
          createdAt: new Date,  
          updatedAt: new Date
        }
    ], {});
=======
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
>>>>>>> test-stock
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Usuarios', null, {});
     
  }
};
