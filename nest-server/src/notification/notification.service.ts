import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class NotificationService {
  constructor(private prisma: PrismaService) {}

  // 게시글이나 댓글에 키워드가 포함되면 알림을 출력합니다.
  async sendKeywordNotification(content: string) {
    const keywords = await this.prisma.keyword_notifications.findMany();
    keywords.forEach((keyword) => {
      if (content.includes(keyword.keyword)) {
        console.log(
          `${keyword.author}님이 등록한 ${keyword.keyword} 가 포함된 글이 등록되었습니다.`,
        );
      }
    });
  }
}
