import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // 게시글이나 댓글에 키워드가 포함되면 알림을 출력합니다.
  async sendKeywordNotification(content: string, author: string) {
    const keywords = await this.prisma.keyword_notifications.findMany({
      where: { author },
    });

    keywords.forEach((keyword) => {
      if (content.includes(keyword.keyword)) {
        console.log(
          `Keyword alert for ${author}: "${keyword.keyword}" found in content`,
        );
      }
    });
  }
}
