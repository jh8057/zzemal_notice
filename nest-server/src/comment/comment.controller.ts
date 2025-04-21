// src/comment/comment.controller.ts
import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CommentService } from './comment.service';
import { NotificationService } from '../notification/notification.service';

@Controller('comments/:postId')
export class CommentController {
  constructor(
    private readonly commentService: CommentService,
    private notificationService: NotificationService,
  ) {}

  // 댓글 목록 조회
  @Get()
  getComments(
    @Param('postId') postId: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    return this.commentService.getComments(+postId, +page, +pageSize); // postId를 숫자로 변환
  }

  // 댓글 작성
  @Post()
  async createComment(
    @Param('postId') postId: string,
    @Body() body: { content: string; author: string },
  ) {
    const comment = await this.commentService.createComment(+postId, body);
    await this.notificationService.sendKeywordNotification(comment.content);
    return comment;
  }

  @Post(':parentId')
  async createCommentReply(
    @Param('postId') postId: string,
    @Param('parentId') parentId: string,
    @Body() body: { content: string; author: string },
  ) {
    const comment = await this.commentService.createComment(
      +postId,
      body,
      +parentId,
    );
    await this.notificationService.sendKeywordNotification(comment.content);
    return comment;
  }
}
