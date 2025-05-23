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

-- 댓글 테이블 (자기참조 포함)
CREATE TABLE Comments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  postId INT NOT NULL,
  parentId INT NULL,  -- 대댓글을 위한 자기참조
  content TEXT NOT NULL,
  author VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (postId) REFERENCES Posts(id) ON DELETE CASCADE,
  FOREIGN KEY (parentId) REFERENCES Comments(id) ON DELETE CASCADE  -- 자기참조 관계
);

-- 키워드 알림 테이블
CREATE TABLE Keyword_notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  author VARCHAR(255) NOT NULL,
  keyword VARCHAR(255) NOT NULL
);
