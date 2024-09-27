import express from 'express';
import prisma from './prisma';
import groupRoutes from './routes/testGroupRoutes';
import cors from 'cors';

const app = express();

app.use(express.json());
// app.use(cors({
//   origin: 'http://localhost:3000', // 프론트엔드 주소 명시
//   credentials: true  // 쿠키 사용 등을 위해 필요한 경우 설정
// }));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

const PORT = process.env.PORT || 5000;


app.use('/api', groupRoutes); 



app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});