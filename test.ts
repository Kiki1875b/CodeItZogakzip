import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    // 테스트로 Group 테이블의 첫 번째 데이터를 가져오는 쿼리
    const group = await prisma.group.findFirst();
    
    if (group) {
      console.log('데이터베이스 연결 성공:', group);
    } else {
      console.log('데이터베이스에 그룹 데이터가 없습니다.');
    }
  } catch (error) {
    console.error('데이터베이스 연결 실패:', error);
  } finally {
    await prisma.$disconnect();  // 연결 종료
  }
}

testConnection();
