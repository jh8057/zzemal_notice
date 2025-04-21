import { Test, TestingModule } from '@nestjs/testing';
import { CommentService } from './comment.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('CommentService', () => {
  let service: CommentService;
  let prismaService: PrismaService;

  // Mock 데이터
  const mockComment = {
    id: 1,
    content: 'This is a comment',
    author: 'Author 1',
    postId: 1,
    parentId: null,
    createdAt: new Date(),
  };

  const mockComments = [
    {
      ...mockComment,
      replies: [
        {
          id: 2,
          content: 'This is a reply',
          author: 'Reply Author',
          postId: 1,
          parentId: 1,
          createdAt: new Date(),
          replies: [],
        },
      ],
    },
  ];

  // PrismaService Mock
  const prismaServiceMock = {
    comments: {
      create: jest.fn().mockResolvedValue(mockComment),
      findMany: jest.fn().mockResolvedValue(mockComments),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentService,
        { provide: PrismaService, useValue: prismaServiceMock },
      ],
    }).compile();

    service = module.get<CommentService>(CommentService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  // 댓글 작성
  describe('1.createComment', () => {
    it('1-1. should create a new comment', async () => {
      const data = { content: 'Test comment', author: 'Test author' };
      const result = await service.createComment(1, data);

      expect(result).toEqual(mockComment);
      expect(prismaService.comments.create).toHaveBeenCalledWith({
        data: {
          postId: 1,
          content: 'Test comment',
          author: 'Test author',
          parentId: null,
        },
      });
    });

    it('1-2. should create a new comment with a parentId', async () => {
      const data = { content: 'Reply comment', author: 'Test author' };
      const result = await service.createComment(1, data, 1);

      expect(result).toEqual(mockComment);
      expect(prismaService.comments.create).toHaveBeenCalledWith({
        data: {
          postId: 1,
          content: 'Reply comment',
          author: 'Test author',
          parentId: 1,
        },
      });
    });
  });

  // 댓글 목록 조회
  describe('2.getComments', () => {
    it('2-1. should return a list of comments with replies', async () => {
      const result = await service.getComments(1);

      expect(result).toEqual(mockComments);
      expect(prismaService.comments.findMany).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: { replies: true },
        skip: 0,
        take: 10,
      });

      expect(result[0].replies).toBeDefined(); // 댓글에 replies가 있는지 확인
      expect(result[0].replies?.length).toBe(1); // replies가 있을 경우 길이를 체크
      expect(result[0].replies?.[0].content).toBe('This is a reply'); // 첫 번째 reply 내용 확인
    });

    it('2-2. should return a paginated list of comments with replies', async () => {
      const result = await service.getComments(1, 2, 5);

      expect(result).toEqual(mockComments);
      expect(prismaService.comments.findMany).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: { replies: true },
        skip: 5,
        take: 5,
      });

      expect(result[0].replies).toBeDefined(); // 댓글에 replies가 있는지 확인 (페이지네이션된 결과에서도)
      expect(result[0].replies?.length).toBe(1); // replies가 있을 경우 길이를 체크
      expect(result[0].replies?.[0].content).toBe('This is a reply'); // 첫 번째 reply 내용 확인
    });

    it('2-3.should return a list of comments without replies', async () => {
      // mock 데이터를 변경하여 replies가 없는 경우를 테스트
      const mockCommentsWithoutReplies = [
        {
          ...mockComment,
          replies: undefined, // replies가 없는 댓글
        },
      ];

      // Prisma가 replies 없이 댓글을 반환하도록 mock
      prismaService.comments.findMany = jest
        .fn()
        .mockResolvedValue(mockCommentsWithoutReplies);

      const result = await service.getComments(1);

      expect(result).toEqual(mockCommentsWithoutReplies);
      expect(prismaService.comments.findMany).toHaveBeenCalledWith({
        where: { postId: 1 },
        include: { replies: true },
        skip: 0,
        take: 10,
      });

      // 댓글에 replies가 없는 경우 확인
      expect(result[0].replies).toBeUndefined(); // replies가 없으면 undefined여야 함
    });
  });
});
