import { Sequelize } from 'sequelize-typescript';
import path from 'path';

export const sequelize = new Sequelize({
  database: 'ZOGAKZIP',
  dialect: 'mysql',
  username: 'admin',
  password: '1234',
  storage: ':memory:',
  models: [path.resolve(__dirname, '../models')] // 모델 폴더 위치
});
