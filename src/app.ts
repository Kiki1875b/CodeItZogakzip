// src/app.ts
import express from 'express';
import postRoutes from './routes/postRoutes';
import groupRoutes from './routes/testGroupRoutes';
import commentRoutes from './routes/testCommentRoutes';
import cors from 'cors';


const app = express();



app.use(cors({
  origin: 'http://localhost:3000', // 프론트엔드 주소 명시
  credentials: true  // 쿠키 사용 등을 위해 필요한 경우 설정
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);

  if(req.body){
    console.log(req.body);
  }
  next();
});


const PORT = process.env.PORT || 5000;

app.use('/api/groups/:GID/posts', postRoutes);

app.use('/api', groupRoutes); 

app.use('/api/posts/', postRoutes);
app.use('/api/posts/:postId/comments', commentRoutes);
app.use('/api/comments',commentRoutes);
app.use(express.json());
// 기본 라우트
app.get('/', (req, res) => {
  res.send('API 서버가 정상적으로 작동 중입니다.');
});

app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

export default app;
