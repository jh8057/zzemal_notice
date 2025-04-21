import { Test, TestingModule } from '@nestjs/testing';
import { CommentController } from './comment.controller';
import { CommentService } from './comment.service';
import { NotificationService } from '../notification/notification.service';

describe('CommentController', () => {
  let controller: CommentController;
  let commentService: jest.Mocked<CommentService>;
  let notificationService: jest.Mocked<NotificationService>;

  // mock 데이터를 공통으로 설정
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

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CommentController],
      providers: [
        {
          provide: CommentService,
          useValue: {
            getComments: jest.fn(),
            createComment: jest.fn(),
          },
        },
        {
          provide: NotificationService,
          useValue: {
            sendKeywordNotification: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<CommentController>(CommentController);
    commentService = module.get(CommentService);
    notificationService = module.get(NotificationService);
  });

  // GET 댓글 목록 조회
  describe('1. getComments', () => {
    it('1-1. should return a list of comments', async () => {
      (commentService.getComments as jest.Mock).mockResolvedValue(mockComments);

      const result = await controller.getComments('1', '1', '10');
      expect(result).toEqual(mockComments);
      expect(commentService.getComments).toHaveBeenCalledWith(1, 1, 10);
    });
  });

  // POST 댓글 작성
  describe('2. createComment', () => {
    it('2-1. should create a comment and send a notification', async () => {
      // Mock data for comment
      const mockComment = {
        id: 1,
        content: 'This is a comment',
        author: 'Author 1',
        postId: 1,
        parentId: null,
        createdAt: new Date(),
      };

      // Mock the service calls properly
      jest
        .spyOn(commentService, 'createComment')
        .mockResolvedValue(mockComment);
      jest
        .spyOn(notificationService, 'sendKeywordNotification')
        .mockResolvedValue(undefined);

      const createCommentDto = {
        content: 'This is a comment',
        author: 'Author 1',
      };

      // Call the controller method
      const result = await controller.createComment('1', createCommentDto);

      // Validate the results
      expect(result).toEqual(mockComment);
      expect(commentService.createComment).toHaveBeenCalledWith(
        1,
        createCommentDto,
      );
      expect(notificationService.sendKeywordNotification).toHaveBeenCalledWith(
        mockComment.content,
      );
    });
  });
});
