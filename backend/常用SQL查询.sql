-- ============================================
-- 常用 SQL 查询语句
-- ============================================

-- 1. 查看所有数据库
SHOW DATABASES;

-- 2. 选择数据库
USE skymark;

-- 3. 查看所有表
SHOW TABLES;

-- 4. 查看表结构
DESCRIBE users;
DESCRIBE goods;
DESCRIBE orders;
DESCRIBE categories;
DESCRIBE addresses;
DESCRIBE favorites;

-- ============================================
-- 查看数据
-- ============================================

-- 查看所有用户
SELECT * FROM users;

-- 查看所有商品
SELECT * FROM goods;

-- 查看所有订单
SELECT * FROM orders;

-- 查看所有分类
SELECT * FROM categories;

-- 查看所有地址
SELECT * FROM addresses;

-- 查看所有收藏
SELECT * FROM favorites;

-- ============================================
-- 统计信息
-- ============================================

-- 统计用户数量
SELECT COUNT(*) as user_count FROM users;

-- 统计商品数量
SELECT COUNT(*) as goods_count FROM goods;

-- 统计订单数量
SELECT COUNT(*) as order_count FROM orders;

-- 统计每个分类的商品数量
SELECT c.name, COUNT(g.id) as goods_count 
FROM categories c 
LEFT JOIN goods g ON c.id = g.category_id 
GROUP BY c.id, c.name;

-- ============================================
-- 条件查询
-- ============================================

-- 查找特定用户
SELECT * FROM users WHERE phone = '13800138000';

-- 查找特定商品
SELECT * FROM goods WHERE title LIKE '%手机%';

-- 查找价格范围
SELECT * FROM goods WHERE price BETWEEN 100 AND 1000;

-- 查找在售商品
SELECT * FROM goods WHERE status = 'onSale';

-- 查找已售商品
SELECT * FROM goods WHERE status = 'sold';

-- ============================================
-- 排序查询
-- ============================================

-- 按价格从低到高排序
SELECT * FROM goods ORDER BY price ASC;

-- 按价格从高到低排序
SELECT * FROM goods ORDER BY price DESC;

-- 按创建时间从新到旧排序
SELECT * FROM goods ORDER BY create_time DESC;

-- 按创建时间从旧到新排序
SELECT * FROM goods ORDER BY create_time ASC;

-- ============================================
-- 关联查询
-- ============================================

-- 查看商品及其分类信息
SELECT 
    g.id,
    g.title,
    g.price,
    g.status,
    c.name as category_name
FROM goods g 
LEFT JOIN categories c ON g.category_id = c.id;

-- 查看订单及其用户信息
SELECT 
    o.id,
    o.order_no,
    o.total_price,
    o.status,
    u.username as buyer_name,
    u.phone as buyer_phone
FROM orders o 
LEFT JOIN users u ON o.buyer_id = u.id;

-- 查看商品及其卖家信息
SELECT 
    g.id,
    g.title,
    g.price,
    u.username as seller_name,
    u.phone as seller_phone
FROM goods g 
LEFT JOIN users u ON g.seller_id = u.id;

-- ============================================
-- 高级查询
-- ============================================

-- 查看每个用户的商品数量
SELECT 
    u.id,
    u.username,
    COUNT(g.id) as goods_count
FROM users u 
LEFT JOIN goods g ON u.id = g.seller_id 
GROUP BY u.id, u.username;

-- 查看每个用户的订单数量
SELECT 
    u.id,
    u.username,
    COUNT(o.id) as order_count
FROM users u 
LEFT JOIN orders o ON u.id = o.buyer_id 
GROUP BY u.id, u.username;

-- 查看最近发布的商品（前10条）
SELECT * FROM goods 
ORDER BY create_time DESC 
LIMIT 10;

-- 查看价格最高的商品（前10条）
SELECT * FROM goods 
ORDER BY price DESC 
LIMIT 10;

-- ============================================
-- 数据清理（谨慎使用！）
-- ============================================

-- 清空表数据（保留表结构）
-- TRUNCATE TABLE users;
-- TRUNCATE TABLE goods;
-- TRUNCATE TABLE orders;

-- 删除表（会删除表结构和数据）
-- DROP TABLE IF EXISTS users;
-- DROP TABLE IF EXISTS goods;
-- DROP TABLE IF EXISTS orders;

-- 删除数据库（会删除所有数据！）
-- DROP DATABASE IF EXISTS skymark;







