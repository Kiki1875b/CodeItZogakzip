import express from 'express';
import {sequelize} from './config/sequelize';
import Group from './models/group';

const app = express();
const PORT = 3000;

app.use(express.json());

app.get('/', async (req, res) => {
  try {
    await sequelize.authenticate(); // DB 연결 테스트
    console.log('DB connection has been established successfully.');
    const groups = await Group.findAll();
    console.log(groups);
    sequelize.sync({ alter: true })
    .then(() => {
      console.log("모델과 데이터베이스가 일치합니다.");
    })
    .catch(error => {
      console.error("모델과 데이터베이스 간 일치하지 않습니다:", error);
    });
    res.status(200).send('DB connection is successful!');
  } catch (error) {
    console.error('Unable to connect to the DB:', error);
    res.status(500).send('Error connecting to database');
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});