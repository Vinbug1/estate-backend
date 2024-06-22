'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const date = new Date();
    return queryInterface.bulkInsert('Roles', [
      {
        name: 'admin',
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'user',
        createdAt: date,
        updatedAt: date,
      },
      {
        name: 'moderator',
        createdAt: date,
        updatedAt: date,
      },
      // Add more roles as needed
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete('Roles', null, {});
  }
};
