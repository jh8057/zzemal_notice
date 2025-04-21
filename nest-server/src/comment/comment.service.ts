import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Comments } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(private prisma: PrismaService) {}

  // 댓글 작성
  async createComment(
    postId: number,
    data: { content: string; author: string },
    parentId?: number,
  ): Promise<Comments> {
    const comment = await this.prisma.comments.create({
      data: {
        postId,
        content: data.content,
        author: data.author,
        parentId: parentId ? parentId : null,
      },
    });
    console.log(`Comment created for post ${postId} by ${data.author}`);
    return comment;
  }

  // 댓글 목록 조회
  async getComments(
    postId: number,
    page: number = 1,
    pageSize: number = 10,
  ): Promise<Comments[]> {
    return this.prisma.comments.findMany({
      where: { postId },
      include: { replies: true },

      skip: (page - 1) * pageSize,
      take: pageSize,
    });
  }
}
