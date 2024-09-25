import { Request, Response } from 'express';
import prisma from '../../prisma/client';

// 댓글 생성
export const createComment = async (req: Request, res: Response) => {
  const { PostID, Nickname, Content, Password } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        PostID: Number(PostID),
        Nickname,
        Content,
        Password,
      },
    });
    res.status(201).json(comment);
  } catch (error) {
    console.error('댓글 생성 오류:', error);
    res.status(500).json({ error: '댓글 생성 실패' });
  }
};

// 특정 게시글의 댓글 조회
export const getCommentsByPostId = async (req: Request, res: Response) => {
  const { PostID } = req.params;

  try {
    const comments = await prisma.comment.findMany({
      where: { PostID: Number(PostID) },
    });
    res.json(comments);
  } catch (error) {
    console.error('댓글 조회 오류:', error);
    res.status(500).json({ error: '댓글 조회 실패' });
  }
};

// 댓글 삭제
export const deleteComment = async (req: Request, res: Response) => {
  const { CommentID } = req.params;
  const { Password } = req.body;

  try {
    // 비밀번호 확인
    const existingComment = await prisma.comment.findUnique({
      where: { CommentID: Number(CommentID) },
    });

    if (!existingComment || existingComment.Password !== Password) {
      return res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
    }

    await prisma.comment.delete({
      where: { CommentID: Number(CommentID) },
    });
    res.json({ message: '댓글이 삭제되었습니다.' });
  } catch (error) {
    console.error('댓글 삭제 오류:', error);
    res.status(500).json({ error: '댓글 삭제 실패' });
  }
};
