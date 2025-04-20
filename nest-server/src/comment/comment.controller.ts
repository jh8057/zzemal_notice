// src/comment/comment.controller.ts
import { Body, Controller, Get, Param, Post as HttpPost } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('posts/:postId/comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  // 댓글 목록 조회
  @Get()
  getComments(@Param('postId') postId: string) {
    return this.commentService.getComments(+postId); // postId를 숫자로 변환
  }

  // 댓글 작성
  @HttpPost()
  createComment(
    @Param('postId') postId: string,
    @Body() body: { content: string; author: string },
  ) {
    return this.commentService.createComment(+postId, body);
  }
}
