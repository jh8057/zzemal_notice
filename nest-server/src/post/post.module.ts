import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PrismaService } from '../../prisma/prisma.service';
import { NotificationService } from '../notification/notification.service';

@Module({
  imports: [],
  controllers: [PostController],
  providers: [PostService, PrismaService, NotificationService],
})
export class PostModule {}
