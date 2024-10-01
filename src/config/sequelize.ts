import { Sequelize } from 'sequelize-typescript';
import path from 'path';

export const sequelize = new Sequelize({
  database: 'zogakzip',
  dialect: 'mysql',
  username: 'root',
  password: '',
  storage: ':memory:',
  models: [path.resolve(__dirname, '../models')] // 모델 폴더 위치
});
