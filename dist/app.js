"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const prisma_1 = __importDefault(require("./prisma"));
const groupRoutes_1 = __importDefault(require("./routes/groupRoutes"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: 'http://localhost:3000', // 프론트엔드 주소 명시
    credentials: true // 쿠키 사용 등을 위해 필요한 경우 설정
}));
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});
const PORT = process.env.PORT || 5000;
app.use('/api', groupRoutes_1.default);
app.listen(PORT, () => {
    console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});
process.on('SIGINT', async () => {
    await prisma_1.default.$disconnect();
    process.exit(0);
});
