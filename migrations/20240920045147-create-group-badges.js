'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Group_Badge', {
      GID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Group',
          key: 'GID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      BadgeID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        allowNull: false,
        references: {
          model: 'Badges',
          key: 'BadgeID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      ObtainedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Group_Badge');
  },
};