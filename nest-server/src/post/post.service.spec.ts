import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('PostService', () => {
  let service: PostService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      posts: {
        create: jest.fn(),
        findUnique: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
        findMany: jest.fn(),
        count: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
    prisma = module.get<PrismaService>(PrismaService);
  });
  // updatePost 게시글 수정
  it('1-1.should create a post', async () => {
    const mockPost = {
      id: 1,
      title: 'Test Title',
      content: 'Test Content',
      author: 'John',
      password: '1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    (prisma.posts.create as jest.Mock).mockResolvedValue(mockPost);

    const result = await service.createPost({
      title: 'Test Title',
      content: 'Test Content',
      author: 'John',
      password: '1234',
    });

    expect(result).toEqual(mockPost);
    expect(prisma.posts.create).toHaveBeenCalledWith({
      data: {
        title: 'Test Title',
        content: 'Test Content',
        author: 'John',
        password: '1234',
      },
    });
  });

  it('1-2.should update a post with correct password', async () => {
    const existingPost = {
      id: 1,
      title: 'Old Title',
      content: 'Old Content',
      author: 'John',
      password: '1234',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const updatedPost = {
      ...existingPost,
      title: 'Updated Title',
    };

    (prisma.posts.findUnique as jest.Mock).mockResolvedValue(existingPost);
    (prisma.posts.update as jest.Mock).mockResolvedValue(updatedPost);

    const result = await service.updatePost('1', {
      password: '1234',
      title: 'Updated Title',
    });

    expect(result).toEqual(updatedPost);
    expect(prisma.posts.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: { password: '1234', title: 'Updated Title' },
    });
  });

  it('1-3.should throw error on wrong password for update', async () => {
    (prisma.posts.findUnique as jest.Mock).mockResolvedValue({
      password: 'wrongpassword',
    });

    await expect(service.updatePost('1', { password: '1234' })).rejects.toThrow(
      'Invalid password',
    );
  });

  // deletePost 게시글 삭제
  it('2-1.should delete post with correct password', async () => {
    (prisma.posts.findUnique as jest.Mock).mockResolvedValue({
      id: 1,
      password: '1234',
    });

    (prisma.posts.delete as jest.Mock).mockResolvedValue(undefined);

    await service.deletePost('1', '1234');

    expect(prisma.posts.delete).toHaveBeenCalledWith({ where: { id: 1 } });
  });

  it('2-2.should throw error on wrong password for delete', async () => {
    (prisma.posts.findUnique as jest.Mock).mockResolvedValue({
      password: 'wrongpassword',
    });

    await expect(service.deletePost('1', '1234')).rejects.toThrow(
      'Invalid password',
    );
  });

  // getPosts 게시글 목록 조회
  it('3.should return posts with pagination', async () => {
    const mockPosts = [
      {
        id: 1,
        title: 'Title1',
        content: '',
        author: 'A',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        title: 'Title2',
        content: '',
        author: 'B',
        password: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    (prisma.posts.findMany as jest.Mock).mockResolvedValue(mockPosts);
    (prisma.posts.count as jest.Mock).mockResolvedValue(2);

    const result = await service.getPosts('', '', 1, 10);

    expect(result).toEqual({ data: mockPosts, total: 2 });
  });
});
