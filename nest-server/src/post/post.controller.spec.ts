// post.controller.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { NotificationService } from '../notification/notification.service';

describe('PostController', () => {
  let controller: PostController;
  let postService: Partial<PostService>;
  let notificationService: Partial<NotificationService>;

  beforeEach(async () => {
    postService = {
      createPost: jest
        .fn()
        .mockResolvedValue({ id: 1, content: 'test content' }),
      updatePost: jest
        .fn()
        .mockResolvedValue({ id: 1, content: 'updated content' }),
      getPosts: jest.fn().mockResolvedValue([{ id: 1 }]),
      deletePost: jest.fn().mockResolvedValue({ success: true }),
    };

    notificationService = {
      sendKeywordNotification: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        { provide: PostService, useValue: postService },
        { provide: NotificationService, useValue: notificationService },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  // POST /posts
  describe('1.create', () => {
    it('1-1. should create a post and send notification', async () => {
      const dto = {
        title: 'test',
        content: 'test content',
        author: 'tester',
        password: '1234',
      };

      const result = await controller.create(dto);
      expect(postService.createPost).toHaveBeenCalledWith(dto);
      expect(notificationService.sendKeywordNotification).toHaveBeenCalledWith(
        'test content',
      );
      expect(result).toEqual({ id: 1, content: 'test content' });
    });

    it('1-2.should throw error if missing fields', async () => {
      await expect(
        controller.create({ title: '', content: '', author: '', password: '' }),
      ).rejects.toThrow();
    });
  });
  // PATCH /posts/update/:id
  describe('2. update', () => {
    it('2-1.should update post and send notification', async () => {
      const dto = {
        password: '1234',
        title: 'updated',
        content: 'updated content',
      };
      const result = await controller.update('1', dto);
      expect(postService.updatePost).toHaveBeenCalledWith('1', dto);
      expect(notificationService.sendKeywordNotification).toHaveBeenCalledWith(
        'updated content',
      );
      expect(result).toEqual({ id: 1, content: 'updated content' });
    });
  });

  // GET /posts/
  describe('3. findAll', () => {
    it('3-1.should return posts', async () => {
      const result = await controller.findAll('test', 'tester', '1', '10');
      expect(postService.getPosts).toHaveBeenCalledWith(
        'test',
        'tester',
        1,
        10,
      );
      expect(result).toEqual([{ id: 1 }]);
    });
  });

  // DELETE /posts/:id
  describe('4. remove', () => {
    it('4-1.should delete post', async () => {
      const result = await controller.remove('1', '1234');
      expect(postService.deletePost).toHaveBeenCalledWith('1', '1234');
      expect(result).toEqual({ success: true });
    });
  });
});
