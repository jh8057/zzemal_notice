import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Posts } from '@prisma/client';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  // 게시글 작성
  async createPost(data: {
    title: string;
    content: string;
    author: string;
    password: string;
  }): Promise<Posts> {
    const post = await this.prisma.posts.create({
      data,
    });
    console.log(`Post created by ${data.author} with title: ${data.title}`);
    return post;
  }

  // 게시글 수정
  async updatePost(
    id: string,
    data: {
      password: string;
      title?: string;
      author?: string;
      content?: string;
    },
  ): Promise<Posts> {
    const post = await this.prisma.posts.findUnique({
      where: { id: Number(id) },
    });

    if (post?.password !== data.password) {
      throw new Error('Invalid password');
    }

    const updatedPost = await this.prisma.posts.update({
      where: { id: Number(id) },
      data,
    });

    console.log(`Post updated: ${updatedPost.title}`);
    return updatedPost;
  }

  // 게시글 삭제
  async deletePost(id: string, password: string): Promise<void> {
    const post = await this.prisma.posts.findUnique({
      where: { id: Number(id) },
    });

    if (post?.password !== password) {
      throw new Error('Invalid password');
    }

    await this.prisma.posts.delete({ where: { id: Number(id) } });
    console.log(`Post deleted: ${id}`);
  }

  // 게시글 목록 조회
  async getPosts(
    title?: string,
    author?: string,
    page = 1,
    pageSize = 10,
  ): Promise<{ data: Posts[]; total: number }> {
    const where: any = {};
    if (title) where.title = { contains: title };
    if (author) where.author = { contains: author };

    const skip = (page - 1) * pageSize;

    const [data, total] = await Promise.all([
      this.prisma.posts.findMany({
        where,
        skip,
        take: pageSize,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.posts.count({ where }),
    ]);

    return { data, total };
  }
}
