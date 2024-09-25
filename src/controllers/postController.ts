import { Request, Response } from 'express';
import prisma from '../../prisma/client';

export const createPost = async (req: Request, res: Response) => {
  const { GID } = req.params;
  const {
    Nickname,
    Title,
    Content,
    PPassword,
    Image,
    Tags,
    Location,
    MemoryMoment,
    IsPublic,
  } = req.body;

  try {
    // 그룹 존재 여부 확인
    const group = await prisma.group.findUnique({
      where: { GID: Number(GID) },
    });

    if (!group) {
      return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
    }

    // 게시글 생성
    const newPost = await prisma.post.create({
      data: {
        GID: Number(GID),
        Nickname,
        Title,
        Content,
        PPassword,
        Image,
        Location,
        MemoryMoment: new Date(MemoryMoment),
        IsPublic,
        LikeCount: 0,
        CommentCount: 0,
        postTags: {
          create: Tags.map((tagName: string) => ({
            tag: {
              connectOrCreate: {
                where: { Name: tagName },
                create: { Name: tagName },
              },
            },
          })),
        },
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    res.status(200).json({
      PostID: newPost.PostID,
      GID: newPost.GID,
      Nickname: newPost.Nickname,
      Title: newPost.Title,
      Content: newPost.Content,
      Image: newPost.Image,
      Tags: newPost.postTags.map((pt) => pt.tag.Name),
      Location: newPost.Location,
      MemoryMoment: newPost.MemoryMoment.toISOString().split('T')[0],
      IsPublic: newPost.IsPublic,
      LikeCount: newPost.LikeCount,
      CommentCount: newPost.CommentCount,
      CreatedDate: newPost.CreatedDate,
    });
  } catch (error) {
    console.error('게시글 생성 오류:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
};

// 게시글 조회 함수 추가
export const getPosts = async (req: Request, res: Response) => {
    const { groupId } = req.params;
    const {
      page = 1,
      pageSize = 10,
      sortBy = 'latest',
      keyword = '',
      isPublic,
    } = req.query;
  
    try {
      // 그룹 존재 여부 확인
      const group = await prisma.group.findUnique({
        where: { GID: Number(groupId) },
      });
  
      if (!group) {
        return res.status(404).json({ message: '그룹을 찾을 수 없습니다.' });
      }
  
      // 페이지네이션을 위한 숫자 변환
      const currentPage = Number(page);
      const take = Number(pageSize);
      const skip = (currentPage - 1) * take;
  
      // 정렬 기준 설정
      let orderBy = {};
      if (sortBy === 'latest') {
        orderBy = { CreatedDate: 'desc' };
      } else if (sortBy === 'mostCommented') {
        orderBy = { CommentCount: 'desc' };
      } else if (sortBy === 'mostLiked') {
        orderBy = { LikeCount: 'desc' };
      }
  
      // 필터 조건 설정
      const whereCondition: any = {
        GID: Number(groupId),
        Title: {
          contains: keyword as string,
        },
      };
  
      if (isPublic !== undefined) {
        whereCondition.IsPublic = isPublic === 'true';
      }
  
      // 총 게시글 수 구하기
      const totalItemCount = await prisma.post.count({
        where: whereCondition,
      });
  
      // 총 페이지 수 계산
      const totalPages = Math.ceil(totalItemCount / take);
  
      // 게시글 조회
      const posts = await prisma.post.findMany({
        where: whereCondition,
        skip,
        take,
        orderBy,
        include: {
          postTags: {
            include: {
              tag: true,
            },
          },
        },
      });
  
      // 응답 데이터 형식에 맞게 변환
      const data = posts.map((post) => ({
        id: post.PostID,
        nickname: post.Nickname,
        title: post.Title,
        imageUrl: post.Image,
        tags: post.postTags.map((pt) => pt.tag.Name),
        location: post.Location,
        moment: post.MemoryMoment.toISOString().split('T')[0],
        isPublic: post.IsPublic,
        likeCount: post.LikeCount,
        commentCount: post.CommentCount,
        createdAt: post.CreatedDate,
      }));
  
      res.status(200).json({
        currentPage,
        totalPages,
        totalItemCount,
        data,
      });
    } catch (error) {
      console.error('게시글 조회 오류:', error);
      res.status(400).json({ message: '잘못된 요청입니다' });
    }
  };

  // 게시글 수정 함수 추가
export const updatePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const {
    nickname,
    title,
    content,
    postPassword,
    imageUrl,
    tags,
    location,
    moment,
    isPublic,
  } = req.body;

  try {
    // 게시글 존재 여부 확인
    const existingPost = await prisma.post.findUnique({
      where: { PostID: Number(postId) },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!existingPost) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비밀번호 확인
    const isPasswordValid = existingPost.PPassword === postPassword;
    // 만약 비밀번호를 해싱하여 저장했다면 bcrypt.compare를 사용해야 합니다.
    // const isPasswordValid = await bcrypt.compare(postPassword, existingPost.PPassword);

    if (!isPasswordValid) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 태그 업데이트 처리
    // 기존 태그를 모두 삭제하고 새로운 태그로 대체합니다.
    await prisma.post_Tag.deleteMany({
      where: { PostID: existingPost.PostID },
    });

    // 새로운 태그 생성 및 연결
    const newTags = tags.map((tagName: string) => ({
      tag: {
        connectOrCreate: {
          where: { Name: tagName },
          create: { Name: tagName },
        },
      },
    }));

    // 게시글 업데이트
    const updatedPost = await prisma.post.update({
      where: { PostID: Number(postId) },
      data: {
        Nickname: nickname,
        Title: title,
        Content: content,
        Image: imageUrl,
        Location: location,
        MemoryMoment: new Date(moment),
        IsPublic: isPublic,
        postTags: {
          create: newTags,
        },
      },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 응답 데이터 구성
    res.status(200).json({
      id: updatedPost.PostID,
      groupId: updatedPost.GID,
      nickname: updatedPost.Nickname,
      title: updatedPost.Title,
      content: updatedPost.Content,
      imageUrl: updatedPost.Image,
      tags: updatedPost.postTags.map((pt) => pt.tag.Name),
      location: updatedPost.Location,
      moment: updatedPost.MemoryMoment.toISOString().split('T')[0],
      isPublic: updatedPost.IsPublic,
      likeCount: updatedPost.LikeCount,
      commentCount: updatedPost.CommentCount,
      createdAt: updatedPost.CreatedDate,
    });
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(400).json({ message: '잘못된 요청입니다' });
  }
};


// 게시글 수정 함수 추가
export const updatePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const {
      nickname,
      title,
      content,
      postPassword,
      imageUrl,
      tags,
      location,
      moment,
      isPublic,
    } = req.body;
  
    try {
      // 게시글 존재 여부 확인
      const existingPost = await prisma.post.findUnique({
        where: { PostID: Number(postId) },
        include: {
          postTags: {
            include: {
              tag: true,
            },
          },
        },
      });
  
      if (!existingPost) {
        return res.status(404).json({ message: '존재하지 않습니다' });
      }
  
      // 비밀번호 확인
      const isPasswordValid = existingPost.PPassword === postPassword;
      // 만약 비밀번호를 해싱하여 저장했다면 bcrypt.compare를 사용해야 합니다.
      // const isPasswordValid = await bcrypt.compare(postPassword, existingPost.PPassword);
  
      if (!isPasswordValid) {
        return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
      }
  
      // 태그 업데이트 처리
      // 기존 태그를 모두 삭제하고 새로운 태그로 대체합니다.
      await prisma.post_Tag.deleteMany({
        where: { PostID: existingPost.PostID },
      });
  
      // 새로운 태그 생성 및 연결
      const newTags = tags.map((tagName: string) => ({
        tag: {
          connectOrCreate: {
            where: { Name: tagName },
            create: { Name: tagName },
          },
        },
      }));
  
      // 게시글 업데이트
      const updatedPost = await prisma.post.update({
        where: { PostID: Number(postId) },
        data: {
          Nickname: nickname,
          Title: title,
          Content: content,
          Image: imageUrl,
          Location: location,
          MemoryMoment: new Date(moment),
          IsPublic: isPublic,
          postTags: {
            create: newTags,
          },
        },
        include: {
          postTags: {
            include: {
              tag: true,
            },
          },
        },
      });
  
      // 응답 데이터 구성
      res.status(200).json({
        id: updatedPost.PostID,
        groupId: updatedPost.GID,
        nickname: updatedPost.Nickname,
        title: updatedPost.Title,
        content: updatedPost.Content,
        imageUrl: updatedPost.Image,
        tags: updatedPost.postTags.map((pt) => pt.tag.Name),
        location: updatedPost.Location,
        moment: updatedPost.MemoryMoment.toISOString().split('T')[0],
        isPublic: updatedPost.IsPublic,
        likeCount: updatedPost.LikeCount,
        commentCount: updatedPost.CommentCount,
        createdAt: updatedPost.CreatedDate,
      });
    } catch (error) {
      console.error('게시글 수정 오류:', error);
      res.status(400).json({ message: '잘못된 요청입니다' });
    }
  };


  // 게시글 삭제 함수
export const deletePost = async (req: Request, res: Response) => {
    const { postId } = req.params;
    const { postPassword } = req.body;
  
    try {
      // 게시글 존재 여부 확인
      const existingPost = await prisma.post.findUnique({
        where: { PostID: Number(postId) },
      });
  
      if (!existingPost) {
        return res.status(404).json({ message: '존재하지 않습니다' });
      }
  
      // 비밀번호 확인
      const isPasswordValid = existingPost.PPassword === postPassword;
      // 비밀번호가 해싱되어 있는 경우:
      // const isPasswordValid = await bcrypt.compare(postPassword, existingPost.PPassword);
  
      if (!isPasswordValid) {
        return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
      }
  
      // 게시글 삭제
      await prisma.post.delete({
        where: { PostID: Number(postId) },
      });
  
      res.status(200).json({ message: '게시글 삭제 성공' });
    } catch (error) {
      console.error('게시글 삭제 오류:', error);
      res.status(400).json({ message: '잘못된 요청입니다' });
    }
  };