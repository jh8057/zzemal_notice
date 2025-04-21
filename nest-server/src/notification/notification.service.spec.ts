import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from './notification.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('NotificationService', () => {
  let service: NotificationService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const mockPrismaService = {
      keyword_notifications: {
        findMany: jest.fn(),
      },
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        NotificationService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  // 알림 확인
  it('1.should print notification when content includes a keyword', async () => {
    const mockKeywords = [
      { author: 'Alice', keyword: 'NestJS' },
      { author: 'Bob', keyword: 'Prisma' },
    ];
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    (prisma.keyword_notifications.findMany as jest.Mock).mockResolvedValue(
      mockKeywords,
    );

    await service.sendKeywordNotification(
      'This post is about NestJS and testing',
    );

    expect(prisma.keyword_notifications.findMany).toHaveBeenCalled();
    expect(spy).toHaveBeenCalledWith(
      'Alice님이 등록한 NestJS 가 포함된 글이 등록되었습니다.',
    );
    expect(spy).not.toHaveBeenCalledWith(
      'Bob님이 등록한 Prisma 가 포함된 글이 등록되었습니다.',
    ); // "Prisma"는 포함되어 있지 않으니까

    spy.mockRestore();
  });

  // 알림 확인
  it('2.should not print anything if no keywords match', async () => {
    const mockKeywords = [{ author: 'Charlie', keyword: 'Database' }];
    const spy = jest.spyOn(console, 'log').mockImplementation(() => {});

    (prisma.keyword_notifications.findMany as jest.Mock).mockResolvedValue(
      mockKeywords,
    );

    await service.sendKeywordNotification('Nothing relevant here');

    expect(prisma.keyword_notifications.findMany).toHaveBeenCalled();
    expect(spy).not.toHaveBeenCalled();

    spy.mockRestore();
  });
});
