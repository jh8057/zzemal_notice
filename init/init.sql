-- 사용하진 않지만 DB 초기화 스크립트입니다.
-- 실제는 dockerfile에서 npx prisma migrate/generate를 통해 DB 초기화합니다.
CREATE DATABASE notice_board;

USE notice_board;

-- 게시글 테이블
CREATE TABLE Posts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- 댓글 테이블
CREATE TABLE Comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT NOT NULL,
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES posts(id) ON DELETE CASCADE
);

-- 키워드 알림 테이블
CREATE TABLE Keyword_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  keyword VARCHAR(255) NOT NULL
);
