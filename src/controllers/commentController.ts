// src/controllers/commentController.ts

import { Request, Response } from 'express';
import prisma from '../prisma';

// 댓글 등록
export const createComment = async (req: Request, res: Response) => {
  const { postId } = req.params;
  const { Nickname, Content, Password } = req.body;

  if (!Nickname || !Content || !Password) {
    return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
  }

  try {
    const post = await prisma.post.findUnique({
      where: { PostID: parseInt(postId, 10) },
    });

    if (!post) {
      return res.status(404).json({ error: '게시글을 찾을 수 없습니다.' });
    }

    const comment = await prisma.comment.create({
      data: {
        PostID: parseInt(postId, 10),
        Nickname,
        Content,
        Password,
      },
    });

    // 댓글 수 업데이트
    await prisma.post.update({
      where: { PostID: parseInt(postId, 10) },
      data: {
        CommentCount: {
          increment: 1,
        },
      },
    });

    res.status(201).json(comment);
  } catch (error) {
    console.error('댓글 등록 오류:', error);
    res.status(500).json({ error: '댓글 등록에 실패했습니다.' });
  }
};

// 댓글 수정
export const updateComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { Content, Password } = req.body;

  if (!Content || !Password) {
    return res.status(400).json({ error: '필수 필드가 누락되었습니다.' });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { CommentID: parseInt(commentId, 10) },
    });

    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.Password !== Password) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    const updatedComment = await prisma.comment.update({
      where: { CommentID: parseInt(commentId, 10) },
      data: { Content },
    });

    res.status(200).json(updatedComment);
  } catch (error) {
    console.error('댓글 수정 오류:', error);
    res.status(500).json({ error: '댓글 수정에 실패했습니다.' });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
  const { commentId } = req.params;
  const { Password } = req.body;

  if (!Password) {
    return res.status(400).json({ error: '비밀번호가 필요합니다.' });
  }

  try {
    const comment = await prisma.comment.findUnique({
      where: { CommentID: parseInt(commentId, 10) },
    });

    if (!comment) {
      return res.status(404).json({ error: '댓글을 찾을 수 없습니다.' });
    }

    if (comment.Password !== Password) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.comment.delete({
      where: { CommentID: parseInt(commentId, 10) },
    });

    // 댓글 수 업데이트
    await prisma.post.update({
      where: { PostID: comment.PostID },
      data: {
        CommentCount: {
          decrement: 1,
        },
      },
    });

    res.status(204).send();
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ error: '댓글 삭제에 실패했습니다.' });
  }
};

// 댓글 목록 조회
export const getComments = async (req: Request, res: Response) => {
  const { postId } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { PostID: parseInt(postId, 10) },
      orderBy: { CreatedDate: 'asc' },
      select: {
        CommentID: true,
        Nickname: true,
        Content: true,
        CreatedDate: true,
      },
    });

    res.status(200).json(comments);
  } catch (error) {
    console.error('댓글 목록 조회 오류:', error);
    res.status(500).json({ error: '댓글 목록 조회에 실패했습니다.' });
  }
};
