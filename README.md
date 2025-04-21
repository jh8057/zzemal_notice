# 설치법

1. 소스를 다운 받습니다.
2. docker를 실행합니다.
   > docker-compose build
   > docker-compose up

## 접속 URL

- front : [localhost](http://localhost)
- backend : [localhost:3000](http://localhost:3000)
- db : localhost:3306

## 상세 설명

1. DB 스키마 생성 스크립트

- `init/init.sql`에 작성했습니다.
- 실제 동작은 `nest-server/prisma/schema.prisma`에 있는 모델 기반으로 `RUN npx prisma migrate dev --name init` , `RUN npx prisma generate` 을 통해 초기화 합니다.
- `nest-server/prisma/init.ts`을 통해 테스트 데이터를 넣어줍니다.

2. 게시글 목록 API

- `post.controller.ts`
- GET /posts

3. 게시글 작성 API

- `post.controller.ts`
- POST /posts

4. 게시글 수정 API

- `post.controller.ts`
- PATCH /posts/update/:id

5. 게시글 삭제 API

- `post.controller.ts`
- DELETE /posts/delete/:id

6. 댓글 목록 API

- `comment.controller.ts`
- GET /comments/:postId?page=1&pageSize=10

7. 댓글 작성 API

- `comment.controller.ts`
- POST /comments/:postId

8. 대댓글 작성 API

- `comment.controller.ts`
- POST /comments/:postId/:parentId

9. 게시물 또는 댓글 등록 시 알림 기능 구현

- `notification.service.ts`
- function : sendKeywordNotification(content: string)
