'use strict';



/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
      await queryInterface.bulkInsert('Usuarios', [{
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
      }], {});
    
  },

  async down (queryInterface, Sequelize) {
   
      await queryInterface.bulkDelete('Usuarios', null, {});
     
  }
};
