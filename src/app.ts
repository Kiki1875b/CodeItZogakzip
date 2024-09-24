import express from 'express';
import prisma from './prisma';
import groupRoutes from './routes/groupRoutes';

const app = express();

app.use(express.json());

const PORT = process.env.PORT || 3000;


app.use('/api', groupRoutes); 



app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT} 에서 실행 중입니다.`);
});

process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});