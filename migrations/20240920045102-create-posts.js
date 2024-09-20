'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Posts', {
      PostID: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      GID: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Group',
          key: 'GID',
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      Nickname: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      Title: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      Image: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      Content: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      Location: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      MemoryMoment: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      IsPublic: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      PPassword: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      CreatedDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.fn('NOW'),
      },
      LikeCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      CommentCount: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Posts');
  },
};