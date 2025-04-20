import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PostModule } from './post/post.module';
import { PrismaModule } from '../prisma/prisma.module';
import { CommentModule } from './comment/comment.module';
import { NotificationService } from './notification/notification.service';

@Module({
  imports: [PrismaModule, PostModule, CommentModule],
  controllers: [AppController],
  providers: [AppService, NotificationService],
})
export class AppModule {}
