import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // 테스트용 게시글 추가
  await prisma.posts.createMany({
    data: [
      {
        title: '첫 번째 게시글',
        content: '이건 첫 번째 테스트입니다',
        author: 'Alice',
        password: '1234',
      },
      {
        title: '두 번째 게시글',
        content: '두 번째 테스트 콘텐츠',
        author: 'Bob',
        password: 'abcd',
      },
    ],
  });

  // 키워드 알림 데이터 추가
  await prisma.keyword_notifications.createMany({
    data: [
      {
        author: 'Alice',
        keyword: '테스트',
      },
      {
        author: 'Bob',
        keyword: '알림',
      },
    ],
  });

  console.log('init data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => {
    prisma.$disconnect();
  });
