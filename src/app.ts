// src/app.ts
import express from 'express';
import postRoutes from './routes/postRoutes';
// 다른 라우트들...
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/', postRoutes);
// 다른 라우트들...

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
