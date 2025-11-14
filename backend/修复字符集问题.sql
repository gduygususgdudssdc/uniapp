-- ============================================
-- 修复字符集和排序规则问题
-- ============================================

USE skymark;

-- 1. 修改数据库字符集
ALTER DATABASE skymark CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. 修改所有表的字符集
ALTER TABLE categories CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE users CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE goods CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE orders CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE addresses CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
ALTER TABLE favorites CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 3. 清空表数据（重新插入）
TRUNCATE TABLE favorites;
TRUNCATE TABLE orders;
TRUNCATE TABLE goods;
TRUNCATE TABLE addresses;
TRUNCATE TABLE users;
TRUNCATE TABLE categories;

-- 4. 验证字符集
SHOW CREATE DATABASE skymark;
SHOW CREATE TABLE categories;
SHOW CREATE TABLE users;







