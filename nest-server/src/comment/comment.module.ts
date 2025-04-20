// src/comment/comment.module.ts
import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule], // PrismaModule을 import하여 PrismaService 사용
  providers: [CommentService],
  controllers: [CommentController],
})
export class CommentModule {}
