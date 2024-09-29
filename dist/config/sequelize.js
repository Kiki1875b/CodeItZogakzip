"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sequelize = void 0;
const sequelize_typescript_1 = require("sequelize-typescript");
const path_1 = __importDefault(require("path"));
exports.sequelize = new sequelize_typescript_1.Sequelize({
    database: 'zogakzip',
    dialect: 'mysql',
    username: 'root',
    password: '',
    storage: ':memory:',
    models: [path_1.default.resolve(__dirname, '../models')] // 모델 폴더 위치
});
