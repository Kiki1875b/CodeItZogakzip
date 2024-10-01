// src/app.ts
import express from 'express';
import postRoutes from './routes/postRoutes';
import prisma from './prisma';
import groupRoutes from './routes/testGroupRoutes';
import commentRoutes from './routes/commentRoutes';
import cors from 'cors';


const app = express();

app.use(express.json());

app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소 명시
  credentials: true  // 쿠키 사용 등을 위해 필요한 경우 설정
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});


const PORT = process.env.PORT || 5000;


app.use('/api', groupRoutes); 
app.use('/api/posts', postRoutes);
app.use('/api/comments',commentRoutes);

// 기본 라우트
app.get('/', (req, res) => {
  res.send('API 서버가 정상적으로 작동 중입니다.');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
