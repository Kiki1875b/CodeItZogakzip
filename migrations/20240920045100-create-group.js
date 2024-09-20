'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Group', {
      GID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      GName: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      GImage: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      GIntro: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      IsPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      GPassword: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      CreatedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      GLikes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      GBadgeCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      PostCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Group');
  },
};