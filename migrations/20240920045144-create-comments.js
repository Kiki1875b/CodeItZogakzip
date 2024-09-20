'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      CommentID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      PostID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Posts',
          key: 'PostID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Password: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      CreatedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  },
};