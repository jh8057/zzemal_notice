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
  ): Promise<Comments> {
    const comment = await this.prisma.comments.create({
      data: {
        postId,
        content: data.content,
        author: data.author,
      },
    });
    console.log(`Comment created for post ${postId} by ${data.author}`);
    return comment;
  }

  // 댓글 목록 조회
  async getComments(postId: number): Promise<Comments[]> {
    return this.prisma.comments.findMany({
      where: { postId },
      //     include: { replies: true },
    });
  }
}
