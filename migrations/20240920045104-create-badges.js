'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Badges', {
      BadgeID: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      Name: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      Description: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      Condition: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Badges');
  }
};
