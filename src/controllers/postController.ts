// src/controllers/postController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

export const createPost = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const {
    nickname,
    title,
    content,
    postPassword,
    groupPassword,
    imageUrl,
    tags,
    location,
    moment,
    isPublic,
  } = req.body;

  // 필수 필드 검증
  if (!nickname || !title || !content || typeof isPublic !== 'boolean') {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    // 그룹 존재 여부 확인
    const group = await prisma.group.findUnique({
      where: { GID: parseInt(groupId, 10) },
    });

    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비공개 그룹인 경우 그룹 비밀번호 확인
    if (!group.IsPublic) {
      if (!groupPassword) {
        return res.status(400).json({ message: '그룹 비밀번호가 필요합니다' });
      }

      if (group.GPassword !== groupPassword) {
        return res.status(403).json({ message: '그룹 비밀번호가 틀렸습니다' });
      }
    }

    // 게시글 생성
    const post = await prisma.post.create({
      data: {
        GID: parseInt(groupId, 10),
        Nickname: nickname,
        Title: title,
        Content: content,
        IsPublic: isPublic,
        PPassword: postPassword || '',
        Image: imageUrl || null,
        Location: location || null,
        MemoryMoment: moment ? new Date(moment) : null,
      },
    });

    // 태그 처리
    if (tags && Array.isArray(tags)) {
      for (const tagName of tags) {
        let tag = await prisma.tag.findUnique({
          where: { Name: tagName },
        });
        if (!tag) {
          tag = await prisma.tag.create({
            data: { Name: tagName },
          });
        }
        await prisma.postTag.create({
          data: {
            PostID: post.PostID,
            TagID: tag.TagID,
          },
        });
      }
    }

    // 그룹의 게시글 수 업데이트
    await prisma.group.update({
      where: { GID: parseInt(groupId, 10) },
      data: {
        PostCount: {
          increment: 1,
        },
      },
    });

    // 응답 데이터 구성
    const responseData = {
      id: post.PostID,
      groupId: post.GID,
      nickname: post.Nickname,
      title: post.Title,
      content: post.Content,
      imageUrl: post.Image,
      tags: tags || [],
      location: post.Location,
      moment: post.MemoryMoment ? post.MemoryMoment.toISOString().split('T')[0] : null,
      isPublic: post.IsPublic,
      likeCount: post.LikeCount,
      commentCount: post.CommentCount,
      createdAt: post.CreatedDate,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('게시글 등록 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

export const getPostsByGroup = async (req: Request, res: Response) => {
  const { groupId } = req.params;
  const {
    page = '1',
    pageSize = '10',
    sortBy = 'latest',
    keyword = '',
    isPublic,
  } = req.query;

  try {
    // 그룹 존재 여부 확인
    const group = await prisma.group.findUnique({
      where: { GID: parseInt(groupId, 10) },
    });

    if (!group) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    const pageNum = parseInt(page as string, 10);
    const pageSizeNum = parseInt(pageSize as string, 10);

    // 정렬 기준 설정
    let orderBy: any = { CreatedDate: 'desc' };
    if (sortBy === 'mostCommented') {
      orderBy = { CommentCount: 'desc' };
    } else if (sortBy === 'mostLiked') {
      orderBy = { LikeCount: 'desc' };
    }

    // 검색 조건 설정
    const whereCondition: any = {
      GID: parseInt(groupId, 10),
      Title: {
        contains: keyword as string,
      },
    };

    if (isPublic !== undefined) {
      whereCondition.IsPublic = isPublic === 'true';
    }

    // 총 아이템 수 계산
    const totalItemCount = await prisma.post.count({
      where: whereCondition,
    });

    const totalPages = Math.ceil(totalItemCount / pageSizeNum);

    // 게시글 목록 조회
    const posts = await prisma.post.findMany({
      where: whereCondition,
      skip: (pageNum - 1) * pageSizeNum,
      take: pageSizeNum,
      orderBy,
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    // 응답 데이터 구성
    const responseData = {
      currentPage: pageNum,
      totalPages,
      totalItemCount,
      data: posts.map((post) => ({
        id: post.PostID,
        nickname: post.Nickname,
        title: post.Title,
        imageUrl: post.Image,
        tags: post.postTags.map((pt) => pt.tag.Name),
        location: post.Location,
        moment: post.MemoryMoment ? post.MemoryMoment.toISOString().split('T')[0] : null,
        isPublic: post.IsPublic,
        likeCount: post.LikeCount,
        commentCount: post.CommentCount,
        createdAt: post.CreatedDate,
      })),
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('게시글 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

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

  if (!postPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
      include: {
        postTags: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비밀번호 확인
    if (post.PPassword !== postPassword) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 게시글 업데이트
    const updatedPost = await prisma.post.update({
      where: { PostID: parseInt(postId, 10) },
      data: {
        Nickname: nickname || post.Nickname,
        Title: title || post.Title,
        Content: content || post.Content,
        Image: imageUrl !== undefined ? imageUrl : post.Image,
        Location: location !== undefined ? location : post.Location,
        MemoryMoment: moment ? new Date(moment) : post.MemoryMoment,
        IsPublic: typeof isPublic === 'boolean' ? isPublic : post.IsPublic,
      },
    });

    // 태그 업데이트
    if (tags && Array.isArray(tags)) {
      // 기존 태그 삭제
      await prisma.postTag.deleteMany({
        where: { PostID: parseInt(postId, 10) },
      });

      // 새로운 태그 추가
      for (const tagName of tags) {
        let tag = await prisma.tag.findUnique({
          where: { Name: tagName },
        });
        if (!tag) {
          tag = await prisma.tag.create({
            data: { Name: tagName },
          });
        }
        await prisma.postTag.create({
          data: {
            PostID: parseInt(postId, 10),
            TagID: tag.TagID,
          },
        });
      }
    }

    // 응답 데이터 구성
    const responseData = {
      id: updatedPost.PostID,
      groupId: updatedPost.GID,
      nickname: updatedPost.Nickname,
      title: updatedPost.Title,
      content: updatedPost.Content,
      imageUrl: updatedPost.Image,
      tags: tags || [],
      location: updatedPost.Location,
      moment: updatedPost.MemoryMoment ? updatedPost.MemoryMoment.toISOString().split('T')[0] : null,
      isPublic: updatedPost.IsPublic,
      likeCount: updatedPost.LikeCount,
      commentCount: updatedPost.CommentCount,
      createdAt: updatedPost.CreatedDate,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('게시글 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

export const deletePost = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { postPassword } = req.body;

  if (!postPassword) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 비밀번호 확인
    if (post.PPassword !== postPassword) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    // 게시글 삭제
    await prisma.post.delete({
      where: { PostID: parseInt(postId, 10) },
    });

    // 그룹의 게시글 수 감소
    await prisma.group.update({
      where: { GID: post.GID },
      data: {
        PostCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: '게시글 삭제 성공' });
  } catch (error) {
    console.error('게시글 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

export const getPostDetail = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
      include: {
        postTags: {
          include: {
            tag: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    // 응답 데이터 구성
    const responseData = {
      id: post.PostID,
      groupId: post.GID,
      nickname: post.Nickname,
      title: post.Title,
      content: post.Content,
      imageUrl: post.Image,
      tags: post.postTags.map((pt) => pt.tag.Name),
      location: post.Location,
      moment: post.MemoryMoment ? post.MemoryMoment.toISOString().split('T')[0] : null,
      isPublic: post.IsPublic,
      likeCount: post.LikeCount,
      commentCount: post.CommentCount,
      createdAt: post.CreatedDate,
    };

    res.status(200).json(responseData);
  } catch (error) {
    console.error('게시글 상세 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

export const verifyPassword = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    if (post.PPassword === password) {
      return res.status(200).json({ message: '비밀번호가 확인되었습니다' });
    } else {
      return res.status(401).json({ message: '비밀번호가 틀렸습니다' });
    }
  } catch (error) {
    console.error('게시글 비밀번호 확인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

export const likePost = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    await prisma.post.update({
      where: { PostID: parseInt(postId, 10) },
      data: {
        LikeCount: {
          increment: 1,
        },
      },
    });

    res.status(200).json({ message: '게시글 공감하기 성공' });
  } catch (error) {
    console.error('게시글 공감하기 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

export const checkIsPublic = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
      select: {
        PostID: true,
        IsPublic: true,
      },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    res.status(200).json({
      id: post.PostID,
      isPublic: post.IsPublic,
    });
  } catch (error) {
    console.error('게시글 공개 여부 확인 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
