import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  // 1. 배지 데이터 생성
  const badgeData = Array.from({ length: 10 }, (_, i) => ({
    Name: `Badge ${i + 1}`,
    Description: `This is the description of Badge ${i + 1}`,
    Condition: `Condition for Badge ${i + 1}`,
  }));

  await prisma.badge.createMany({
    data: badgeData,
  });
  console.log("Inserted badges.");

  // 2. 그룹 데이터 생성 (100개)
  const groupData = Array.from({ length: 100 }, (_, i) => ({
    GName: `Test Group ${i + 1}`,
    GImage: `group_image_${i + 1}.png`,
    GIntro: `This is the introduction of Test Group ${i + 1}`,
    IsPublic: i % 2 === 0, // 짝수는 공개, 홀수는 비공개
    GPassword: `password${i + 1}`,
    CreatedDate: new Date(),
    GLikes: Math.floor(Math.random() * 1000), // 랜덤 공감 수
    GBadgeCount: Math.floor(Math.random() * 10), // 랜덤 배지 수
    PostCount: Math.floor(Math.random() * 50), // 랜덤 게시글 수
  }));

  await prisma.group.createMany({
    data: groupData,
  });
  console.log("Inserted groups.");

  // 3. 생성된 그룹의 GID를 모두 가져옴
  const groups = await prisma.group.findMany({
    select: { GID: true },  // GID 필드만 선택
  });
  const groupIds = groups.map(group => group.GID); // GID 목록 배열로 변환

  // 4. 게시글 데이터 생성 (200개)
  const postData = Array.from({ length: 200 }, (_, i) => ({
    GID: groupIds[Math.floor(Math.random() * groupIds.length)], // 존재하는 그룹 ID만 할당
    Nickname: `User${i + 1}`,
    Title: `Test Post ${i + 1}`,
    Image: `post_image_${i + 1}.png`,
    Content: `This is the content of Test Post ${i + 1}`,
    Location: `Location ${i + 1}`,
    MemoryMoment: new Date(),
    IsPublic: i % 2 === 0, // 짝수는 공개, 홀수는 비공개
    PPassword: `postpassword${i + 1}`,
    CreatedDate: new Date(),
    LikeCount: Math.floor(Math.random() * 500), // 랜덤 좋아요 수
    CommentCount: Math.floor(Math.random() * 20), // 랜덤 댓글 수
  }));

  await prisma.post.createMany({
    data: postData,
  });
  console.log("Inserted posts.");

  // 5. 생성된 게시글의 PostID를 모두 가져옴
  const posts = await prisma.post.findMany({
    select: { PostID: true },  // PostID 필드만 선택
  });
  const postIds = posts.map(post => post.PostID); // PostID 목록 배열로 변환

  // 6. 댓글 데이터 생성 (500개)
  const commentData = Array.from({ length: 500 }, (_, i) => ({
    PostID: postIds[Math.floor(Math.random() * postIds.length)], // 존재하는 PostID만 할당
    Nickname: `Commenter${i + 1}`,
    Content: `This is the content of Comment ${i + 1}`,
    Password: `commentpassword${i + 1}`,
    CreatedDate: new Date(),
  }));

  await prisma.comment.createMany({
    data: commentData,
  });
  console.log("Inserted comments.");

  // 7. 그룹-배지 관계 데이터 생성 (각 그룹에 배지 1~3개 할당)
  const badges = await prisma.badge.findMany({
    select: { BadgeID: true },  // BadgeID 필드만 선택
  });
  const badgeIds = badges.map(badge => badge.BadgeID); // BadgeID 목록 배열로 변환

  const groupBadgeSet = new Set<string>(); // 중복 방지용 Set

  const groupBadgeData = Array.from({ length: 150 }, () => {
    let gid, badgeId;
    do {
      gid = groupIds[Math.floor(Math.random() * groupIds.length)]; // 존재하는 그룹 ID만 할당
      badgeId = badgeIds[Math.floor(Math.random() * badgeIds.length)]; // 존재하는 배지 ID만 할당
    } while (groupBadgeSet.has(`${gid}-${badgeId}`)); // 중복 체크
    groupBadgeSet.add(`${gid}-${badgeId}`); // 고유한 조합만 추가

    return {
      GID: gid,
      BadgeID: badgeId,
      ObtainedDate: new Date(),
    };
  });

  await prisma.groupBadge.createMany({
    data: groupBadgeData,
  });
  console.log("Inserted group-badge relationships.");

  // 8. 태그 데이터 생성 (50개)
  const tagData = Array.from({ length: 50 }, (_, i) => ({
    Name: `Tag ${i + 1}`,
  }));

  await prisma.tag.createMany({
    data: tagData,
  });
  console.log("Inserted tags.");

  // 9. 태그 ID 목록을 가져옴
  const tags = await prisma.tag.findMany({
    select: { TagID: true },  // TagID 필드만 선택
  });
  const tagIds = tags.map(tag => tag.TagID); // TagID 목록 배열로 변환

  // 10. 게시글-태그 관계 데이터 생성 (각 게시글에 태그 1~3개 할당)
  const postTagSet = new Set<string>();  // 중복 방지용 Set

  const postTagData = Array.from({ length: 300 }, () => {
    let postId, tagId;
    do {
      postId = postIds[Math.floor(Math.random() * postIds.length)]; // 존재하는 PostID만 할당
      tagId = tagIds[Math.floor(Math.random() * tagIds.length)]; // 존재하는 TagID만 할당
    } while (postTagSet.has(`${postId}-${tagId}`)); // 중복 체크
    postTagSet.add(`${postId}-${tagId}`); // 고유한 조합만 추가

    return {
      PostID: postId,
      TagID: tagId,
    };
  });

  await prisma.postTag.createMany({
    data: postTagData,
  });
  console.log("Inserted post-tag relationships.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
