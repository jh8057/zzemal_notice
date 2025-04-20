import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PostService } from './post.service';
import { NotificationService } from '../notification/notification.service';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private notificationService: NotificationService,
  ) {}

  @Post()
  async create(
    @Body()
    createPostDto: {
      title: string;
      content: string;
      author: string;
      password: string;
    },
  ) {
    if (
      !createPostDto.title ||
      !createPostDto.content ||
      !createPostDto.author ||
      !createPostDto.password
    ) {
      throw new Error('All fields are required');
    }
    const post = await this.postService.createPost(createPostDto);
    await this.notificationService.sendKeywordNotification(
      post.content,
      post.author,
    );
    return post;
  }

  @Patch('update/:id')
  async update(
    @Param('id') id: string,
    @Body()
    updatePostDto: {
      password: string;
      title?: string;
      content?: string;
      author?: string;
    },
  ) {
    const post = await this.postService.updatePost(id, updatePostDto);
    await this.notificationService.sendKeywordNotification(
      post.content,
      post.author,
    );
    return post;
  }

  @Get()
  async findAll(
    @Query('title') title: string,
    @Query('author') author: string,
    @Query('page') page = '1',
    @Query('pageSize') pageSize = '10',
  ) {
    const pageNumber = parseInt(page, 10);
    const pageSizeNumber = parseInt(pageSize, 10);

    return this.postService.getPosts(title, author, pageNumber, pageSizeNumber);
  }

  @Delete('delete/:id')
  async remove(@Param('id') id: string, @Body('password') password: string) {
    return this.postService.deletePost(id, password);
  }
}
