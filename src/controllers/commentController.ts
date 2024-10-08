// src/controllers/commentController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

// 댓글 등록
export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { nickname, content, password } = req.body;

  if (!nickname || !content || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    const comment = await prisma.comment.create({
      data: {
        PostID: parseInt(postId, 10),
        Nickname: nickname,
        Content: content,
        Password: password,
      },
    });

    // 댓글 수 업데이트 (필요 시)
    await prisma.post.update({
      where: { PostID: parseInt(postId, 10) },
      data: {
        CommentCount: {
          increment: 1,
        },
      },
    });

    res.status(200).json({
      id: comment.CommentID,
      nickname: comment.Nickname,
      content: comment.Content,
      createdAt: comment.CreatedDate,
    });
  } catch (error) {
    console.error('댓글 등록 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 댓글 목록 조회 (페이징 포함)
export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const page = parseInt(req.query.page as string, 10) || 1;
  const pageSize = parseInt(req.query.pageSize as string, 10) || 10;

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
    });

    if (!post) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    const totalItemCount = await prisma.comment.count({
      where: { PostID: parseInt(postId, 10) },
    });

    const totalPages = Math.ceil(totalItemCount / pageSize);

    const comments = await prisma.comment.findMany({
      where: { PostID: parseInt(postId, 10) },
      skip: (page - 1) * pageSize,
      take: pageSize,
      orderBy: { CreatedDate: 'asc' },
      select: {
        CommentID: true,
        Nickname: true,
        Content: true,
        CreatedDate: true,
      },
    });
    const tempCheck = {currentPage: page,
    totalPages,
    totalItemCount,
    data: comments.map((comment) => ({
      id: comment.CommentID,
      nickname: comment.Nickname,
      content: comment.Content,
      createdAt: comment.CreatedDate,
    }))}
    console.log(tempCheck);
    
    res.status(200).json({
      currentPage: page,
      totalPages,
      totalItemCount,
      data: comments.map((comment) => ({
        id: comment.CommentID,
        nickname: comment.Nickname,
        content: comment.Content,
        createdAt: comment.CreatedDate,
      })),
    });
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { nickname, content, password } = req.body;

  if (!nickname || !content || !password) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { CommentID: parseInt(commentId, 10) },
    });

    if (!comment) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    if (comment.Password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    const updatedComment = await prisma.comment.update({
      where: { CommentID: parseInt(commentId, 10) },
      data: {
        Nickname: nickname,
        Content: content,
      },
    });

    res.status(200).json({
      id: updatedComment.CommentID,
      nickname: updatedComment.Nickname,
      content: updatedComment.Content,
      createdAt: updatedComment.CreatedDate,
    });
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { password } = req.body;

  if (!password) {
    return res.status(400).json({ message: '잘못된 요청입니다' });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { CommentID: parseInt(commentId, 10) },
    });

    if (!comment) {
      return res.status(404).json({ message: '존재하지 않습니다' });
    }

    if (comment.Password !== password) {
      return res.status(403).json({ message: '비밀번호가 틀렸습니다' });
    }

    await prisma.comment.delete({
      where: { CommentID: parseInt(commentId, 10) },
    });

    // 댓글 수 감소 (필요 시)
    await prisma.post.update({
      where: { PostID: comment.PostID },
      data: {
        CommentCount: {
          decrement: 1,
        },
      },
    });

    res.status(200).json({ message: '답글 삭제 성공' });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ message: '서버 오류가 발생했습니다' });
  }
};
