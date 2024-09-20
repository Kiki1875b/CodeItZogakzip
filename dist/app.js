"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const app = (0, express_1.default)();
// 미들웨어 설정
app.use(express_1.default.json());
const PORT = process.env.PORT || 3000;
app.get('/', async (req, res) => {
    try {
        console.log("접속 성공");
    }
    catch (error) {
        res.status(500).json({ error: "에러 발생" });
    }
});
app.get('/test', async (req, res) => {
    try {
        // DB 연결 확인 (간단한 쿼리 실행)
        await prisma_1.default.$queryRaw `SELECT 1`; // 테스트 쿼리
        res.status(200).json({ message: "DB 연결 성공" });
    }
    catch (error) {
        console.error("DB 연결 실패:", error);
        res.status(500).json({ error: "DB 연결 실패" });
    }
});
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
