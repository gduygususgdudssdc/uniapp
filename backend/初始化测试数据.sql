-- ============================================
-- 初始化测试数据
-- ============================================

USE skymark;

-- 清空表数据（可选，谨慎使用！）
-- TRUNCATE TABLE categories;
-- TRUNCATE TABLE goods;
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE orders;
-- TRUNCATE TABLE addresses;
-- TRUNCATE TABLE favorites;

-- ============================================
-- 插入分类数据
-- ============================================

INSERT INTO categories (name, icon, parent_id, create_time, update_time) VALUES
('电子产品', '📱', NULL, NOW(), NOW()),
('服装配饰', '👔', NULL, NOW(), NOW()),
('家居用品', '🏠', NULL, NOW(), NOW()),
('图书文具', '📚', NULL, NOW(), NOW()),
('运动户外', '⚽', NULL, NOW(), NOW()),
('美妆护肤', '💄', NULL, NOW(), NOW()),
('食品饮料', '🍔', NULL, NOW(), NOW()),
('其他', '📦', NULL, NOW(), NOW());

-- 查看插入的分类
SELECT * FROM categories;

-- ============================================
-- 插入测试用户（可选）
-- ============================================

-- 密码是 123456 的 MD5 值：e10adc3949ba59abbe56e057f20f883e
INSERT INTO users (username, phone, password, email, avatar, address, level, score, create_time, update_time) VALUES
('测试用户1', '13800138001', 'e10adc3949ba59abbe56e057f20f883e', 'test1@example.com', 'https://i.pravatar.cc/100?img=1', '北京市', 'V1', 0, NOW(), NOW()),
('测试用户2', '13800138002', 'e10adc3949ba59abbe56e057f20f883e', 'test2@example.com', 'https://i.pravatar.cc/100?img=2', '上海市', 'V1', 0, NOW(), NOW());

-- 查看插入的用户
SELECT id, username, phone, email FROM users;

-- ============================================
-- 插入测试商品（可选）
-- ============================================

-- 注意：需要先有用户和分类数据
-- seller_id 和 category_id 需要根据实际插入的数据调整

-- 获取第一个用户ID和第一个分类ID
SET @user_id = (SELECT id FROM users LIMIT 1);
SET @category_id = (SELECT id FROM categories LIMIT 1);

-- 插入测试商品
INSERT INTO goods (seller_id, category_id, title, description, price, images, location, status, views, likes, create_time, update_time) VALUES
(@user_id, @category_id, '测试商品1', '这是一个测试商品描述', 99.00, '["https://images.unsplash.com/photo-1610945265064-0039823fe583?w=400&h=400&fit=crop"]', '北京市', 'onSale', 0, 0, NOW(), NOW()),
(@user_id, @category_id, '测试商品2', '这是另一个测试商品描述', 199.00, '["https://images.unsplash.com/photo-1610945265064-0039823fe583?w=400&h=400&fit=crop"]', '上海市', 'onSale', 0, 0, NOW(), NOW());

-- 查看插入的商品
SELECT id, title, price, status FROM goods;

-- ============================================
-- 验证数据
-- ============================================

-- 统计各表数据量
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'users', COUNT(*) FROM users
UNION ALL
SELECT 'goods', COUNT(*) FROM goods
UNION ALL
SELECT 'orders', COUNT(*) FROM orders
UNION ALL
SELECT 'addresses', COUNT(*) FROM addresses
UNION ALL
SELECT 'favorites', COUNT(*) FROM favorites;







