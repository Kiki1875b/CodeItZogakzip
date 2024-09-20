"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const sequelize_1 = require("./config/sequelize");
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
app.get('/', async (req, res) => {
    try {
        await sequelize_1.sequelize.authenticate(); // DB 연결 테스트
        console.log('DB connection has been established successfully.');
        sequelize_1.sequelize.sync({ alter: true })
            .then(() => {
            console.log("모델과 데이터베이스가 일치합니다.");
        })
            .catch(error => {
            console.error("모델과 데이터베이스 간 일치하지 않습니다:", error);
        });
        res.status(200).send('DB connection is successful!');
    }
    catch (error) {
        console.error('Unable to connect to the DB:', error);
        res.status(500).send('Error connecting to database');
    }
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
