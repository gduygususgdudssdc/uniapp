-- ============================================
-- 完整数据库初始化脚本（修复版）
-- 包含所有表的健全测试数据
-- ============================================

USE skymark;

-- 设置字符集
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;
SET character_set_connection=utf8mb4;

-- ============================================
-- 清空所有表数据
-- ============================================
TRUNCATE TABLE favorites;
TRUNCATE TABLE orders;
TRUNCATE TABLE goods;
TRUNCATE TABLE addresses;
TRUNCATE TABLE users;
TRUNCATE TABLE categories;

-- ============================================
-- 1. 插入分类数据（主分类和子分类）
-- ============================================

-- 插入主分类
INSERT INTO categories (name, icon, parent_id, create_time, update_time) VALUES
('电子产品', '📱', NULL, NOW(), NOW()),
('服装配饰', '👔', NULL, NOW(), NOW()),
('家居用品', '🏠', NULL, NOW(), NOW()),
('图书文具', '📚', NULL, NOW(), NOW()),
('运动户外', '⚽', NULL, NOW(), NOW()),
('美妆护肤', '💄', NULL, NOW(), NOW()),
('食品饮料', '🍔', NULL, NOW(), NOW()),
('其他', '📦', NULL, NOW(), NOW());

-- 获取主分类ID并插入子分类
SET @cat_electronics = (SELECT id FROM categories WHERE name = '电子产品' COLLATE utf8mb4_unicode_ci);
SET @cat_clothing = (SELECT id FROM categories WHERE name = '服装配饰' COLLATE utf8mb4_unicode_ci);
SET @cat_home = (SELECT id FROM categories WHERE name = '家居用品' COLLATE utf8mb4_unicode_ci);
SET @cat_books = (SELECT id FROM categories WHERE name = '图书文具' COLLATE utf8mb4_unicode_ci);
SET @cat_sports = (SELECT id FROM categories WHERE name = '运动户外' COLLATE utf8mb4_unicode_ci);
SET @cat_beauty = (SELECT id FROM categories WHERE name = '美妆护肤' COLLATE utf8mb4_unicode_ci);

-- 插入子分类
INSERT INTO categories (name, icon, parent_id, create_time, update_time) VALUES
-- 电子产品子分类
('手机', '📱', @cat_electronics, NOW(), NOW()),
('电脑', '💻', @cat_electronics, NOW(), NOW()),
('相机', '📷', @cat_electronics, NOW(), NOW()),
('耳机', '🎧', @cat_electronics, NOW(), NOW()),
('智能设备', '⌚', @cat_electronics, NOW(), NOW()),
-- 服装配饰子分类
('男装', '👔', @cat_clothing, NOW(), NOW()),
('女装', '👗', @cat_clothing, NOW(), NOW()),
('鞋靴', '👠', @cat_clothing, NOW(), NOW()),
('箱包', '👜', @cat_clothing, NOW(), NOW()),
('配饰', '💍', @cat_clothing, NOW(), NOW()),
-- 家居用品子分类
('家具', '🛋️', @cat_home, NOW(), NOW()),
('家电', '📺', @cat_home, NOW(), NOW()),
('厨具', '🍳', @cat_home, NOW(), NOW()),
('装饰', '🖼️', @cat_home, NOW(), NOW()),
-- 图书文具子分类
('小说', '📖', @cat_books, NOW(), NOW()),
('教材', '📕', @cat_books, NOW(), NOW()),
('工具书', '📘', @cat_books, NOW(), NOW()),
('文具', '✏️', @cat_books, NOW(), NOW()),
-- 运动户外子分类
('运动鞋', '👟', @cat_sports, NOW(), NOW()),
('运动服', '🏃', @cat_sports, NOW(), NOW()),
('健身器材', '🏋️', @cat_sports, NOW(), NOW()),
('户外装备', '🎒', @cat_sports, NOW(), NOW()),
-- 美妆护肤子分类
('护肤品', '🧴', @cat_beauty, NOW(), NOW()),
('彩妆', '💋', @cat_beauty, NOW(), NOW()),
('香水', '🌸', @cat_beauty, NOW(), NOW());

-- ============================================
-- 2. 插入用户数据
-- ============================================

-- 密码都是 123456 的 MD5 值：e10adc3949ba59abbe56e057f20f883e
INSERT INTO users (username, phone, password, email, avatar, address, level, score, create_time, update_time) VALUES
('张三', '13800138001', 'e10adc3949ba59abbe56e057f20f883e', 'zhangsan@example.com', 'https://i.pravatar.cc/100?img=1', '北京市朝阳区', 'V2', 150, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
('李四', '13800138002', 'e10adc3949ba59abbe56e057f20f883e', 'lisi@example.com', 'https://i.pravatar.cc/100?img=2', '上海市浦东新区', 'V1', 80, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
('王五', '13800138003', 'e10adc3949ba59abbe56e057f20f883e', 'wangwu@example.com', 'https://i.pravatar.cc/100?img=3', '广州市天河区', 'V3', 300, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
('赵六', '13800138004', 'e10adc3949ba59abbe56e057f20f883e', 'zhaoliu@example.com', 'https://i.pravatar.cc/100?img=4', '深圳市南山区', 'V1', 50, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
('孙七', '13800138005', 'e10adc3949ba59abbe56e057f20f883e', 'sunqi@example.com', 'https://i.pravatar.cc/100?img=5', '杭州市西湖区', 'V2', 200, DATE_SUB(NOW(), INTERVAL 45 DAY), NOW()),
('周八', '13800138006', 'e10adc3949ba59abbe56e057f20f883e', 'zhouba@example.com', 'https://i.pravatar.cc/100?img=6', '成都市锦江区', 'V1', 30, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
('吴九', '13800138007', 'e10adc3949ba59abbe56e057f20f883e', 'wujiu@example.com', 'https://i.pravatar.cc/100?img=7', '武汉市江汉区', 'V2', 120, DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
('郑十', '13800138008', 'e10adc3949ba59abbe56e057f20f883e', 'zhengshi@example.com', 'https://i.pravatar.cc/100?img=8', '西安市雁塔区', 'V1', 60, DATE_SUB(NOW(), INTERVAL 15 DAY), NOW());

-- ============================================
-- 3. 插入商品数据
-- ============================================

-- 获取用户ID和分类ID
SET @user1 = (SELECT id FROM users WHERE phone = '13800138001' LIMIT 1);
SET @user2 = (SELECT id FROM users WHERE phone = '13800138002' LIMIT 1);
SET @user3 = (SELECT id FROM users WHERE phone = '13800138003' LIMIT 1);
SET @user4 = (SELECT id FROM users WHERE phone = '13800138004' LIMIT 1);
SET @user5 = (SELECT id FROM users WHERE phone = '13800138005' LIMIT 1);

SET @cat_phone = (SELECT id FROM categories WHERE name = '手机' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_computer = (SELECT id FROM categories WHERE name = '电脑' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_camera = (SELECT id FROM categories WHERE name = '相机' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_headphone = (SELECT id FROM categories WHERE name = '耳机' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_male_clothing = (SELECT id FROM categories WHERE name = '男装' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_female_clothing = (SELECT id FROM categories WHERE name = '女装' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_shoes = (SELECT id FROM categories WHERE name = '鞋靴' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_furniture = (SELECT id FROM categories WHERE name = '家具' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_appliance = (SELECT id FROM categories WHERE name = '家电' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_novel = (SELECT id FROM categories WHERE name = '小说' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_sports_shoes = (SELECT id FROM categories WHERE name = '运动鞋' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @cat_skincare = (SELECT id FROM categories WHERE name = '护肤品' COLLATE utf8mb4_unicode_ci LIMIT 1);

-- 插入商品数据
INSERT INTO goods (seller_id, category_id, title, description, price, original_price, images, location, `condition`, status, views, likes, create_time, update_time) VALUES
-- 电子产品
(@user1, @cat_phone, 'iPhone 13 Pro 256GB 深空灰色', '自用iPhone 13 Pro，256GB深空灰色，99新，无拆无修，原装充电器数据线都在，包装盒齐全。使用一年，电池健康度95%，功能一切正常。', 5500.00, 8799.00, '["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop","https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"]', '北京市朝阳区', '99新', 'onSale', 156, 23, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(@user2, @cat_computer, 'MacBook Pro 14寸 M1 Pro芯片', 'MacBook Pro 14寸，M1 Pro芯片，16GB内存，512GB存储。2021年购买，使用频率低，几乎全新。原装包装盒和充电器都在。', 12000.00, 18999.00, '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop"]', '上海市浦东新区', '95新', 'onSale', 89, 15, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(@user3, @cat_camera, '佳能 EOS R6 全画幅微单相机', '佳能EOS R6全画幅微单相机，配24-105mm镜头。专业级相机，成色很好，快门次数约5000次。适合摄影爱好者。', 15000.00, 22000.00, '["https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop"]', '广州市天河区', '9成新', 'onSale', 234, 42, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
(@user4, @cat_headphone, 'AirPods Pro 2代 降噪耳机', 'AirPods Pro 2代，主动降噪，空间音频。使用半年，功能完好，充电盒有轻微使用痕迹。', 1200.00, 1899.00, '["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=400&h=400&fit=crop"]', '深圳市南山区', '9成新', 'onSale', 67, 12, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),
(@user5, @cat_phone, '华为 Mate 50 Pro 512GB', '华为Mate 50 Pro，512GB存储，昆仑玻璃版。使用3个月，几乎全新，无任何划痕。全套配件齐全。', 4800.00, 6999.00, '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"]', '杭州市西湖区', '99新', 'onSale', 123, 28, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),

-- 服装配饰
(@user1, @cat_male_clothing, '优衣库 男士羽绒服 L码', '优衣库男士羽绒服，L码，黑色。只穿过几次，很新。保暖效果好，适合秋冬季节。', 299.00, 599.00, '["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop"]', '北京市朝阳区', '9成新', 'onSale', 45, 8, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),
(@user2, @cat_female_clothing, 'ZARA 女士连衣裙 M码', 'ZARA女士连衣裙，M码，蓝色碎花。只穿过一次，几乎全新。款式时尚，适合春夏季节。', 199.00, 399.00, '["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop"]', '上海市浦东新区', '99新', 'onSale', 78, 16, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),
(@user3, @cat_shoes, 'Nike Air Max 270 运动鞋 42码', 'Nike Air Max 270运动鞋，42码，黑白配色。穿过几次，鞋底有轻微磨损，整体成色不错。', 450.00, 899.00, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"]', '广州市天河区', '8成新', 'onSale', 112, 24, DATE_SUB(NOW(), INTERVAL 8 DAY), NOW()),
(@user4, @cat_shoes, 'Adidas 三叶草 板鞋 41码', 'Adidas三叶草经典板鞋，41码，白色。几乎全新，只试穿过一次。原装鞋盒都在。', 380.00, 699.00, '["https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop"]', '深圳市南山区', '99新', 'onSale', 56, 11, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),

-- 家居用品
(@user1, @cat_furniture, '宜家 书桌 白色 120cm', '宜家书桌，白色，120cm宽。使用一年，成色很好，无损坏。适合学生或办公使用。', 299.00, 599.00, '["https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"]', '北京市朝阳区', '9成新', 'onSale', 34, 6, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
(@user2, @cat_appliance, '小米 空气净化器 Pro', '小米空气净化器Pro，使用半年，功能正常。滤芯还有一半寿命。适合小户型使用。', 599.00, 1299.00, '["https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400&h=400&fit=crop"]', '上海市浦东新区', '9成新', 'onSale', 89, 18, DATE_SUB(NOW(), INTERVAL 5 DAY), NOW()),
(@user3, @cat_furniture, '懒人沙发 单人款 灰色', '懒人沙发，单人款，灰色。使用3个月，很舒适。搬家出售，成色很好。', 199.00, 399.00, '["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400&h=400&fit=crop"]', '广州市天河区', '95新', 'onSale', 67, 13, DATE_SUB(NOW(), INTERVAL 4 DAY), NOW()),

-- 图书文具
(@user4, @cat_novel, '《三体》全集 刘慈欣著', '《三体》全集三册，刘慈欣著。正版图书，保存完好，无破损无涂画。经典科幻小说。', 45.00, 89.00, '["https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"]', '深圳市南山区', '9成新', 'onSale', 23, 5, DATE_SUB(NOW(), INTERVAL 7 DAY), NOW()),
(@user5, @cat_novel, '《百年孤独》马尔克斯', '《百年孤独》马尔克斯著，正版图书。读过一次，保存完好。经典文学作品。', 28.00, 55.00, '["https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=400&h=400&fit=crop"]', '杭州市西湖区', '9成新', 'onSale', 45, 9, DATE_SUB(NOW(), INTERVAL 3 DAY), NOW()),

-- 运动户外
(@user1, @cat_sports_shoes, '李宁 跑步鞋 43码', '李宁跑步鞋，43码，黑色。穿过几次，适合日常跑步。鞋底有轻微磨损。', 180.00, 399.00, '["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop"]', '北京市朝阳区', '8成新', 'onSale', 34, 7, DATE_SUB(NOW(), INTERVAL 6 DAY), NOW()),

-- 美妆护肤
(@user2, @cat_skincare, 'SK-II 神仙水 230ml', 'SK-II神仙水，230ml，还剩80%左右。正品保证，适合油性肌肤。', 680.00, 1590.00, '["https://images.unsplash.com/photo-1556228578-0d85b1a4d571?w=400&h=400&fit=crop"]', '上海市浦东新区', '9成新', 'onSale', 156, 32, DATE_SUB(NOW(), INTERVAL 2 DAY), NOW()),

-- 已售出商品
(@user3, @cat_phone, '小米 12S Ultra 256GB', '小米12S Ultra，256GB，徕卡影像。已售出。', 3500.00, 5999.00, '["https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop"]', '广州市天河区', '95新', 'sold', 89, 19, DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@user4, @cat_computer, '联想 ThinkPad X1 Carbon', '联想ThinkPad X1 Carbon，已售出。', 4500.00, 8999.00, '["https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop"]', '深圳市南山区', '9成新', 'sold', 67, 14, DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 2 DAY));

-- ============================================
-- 4. 插入地址数据
-- ============================================

INSERT INTO addresses (user_id, name, phone, province, city, district, detail, is_default, create_time, update_time) VALUES
(@user1, '张三', '13800138001', '北京市', '北京市', '朝阳区', '建国路88号SOHO现代城A座1001室', 1, DATE_SUB(NOW(), INTERVAL 30 DAY), NOW()),
(@user1, '张三', '13800138001', '北京市', '北京市', '海淀区', '中关村大街1号海龙大厦2005室', 0, DATE_SUB(NOW(), INTERVAL 25 DAY), NOW()),
(@user2, '李四', '13800138002', '上海市', '上海市', '浦东新区', '陆家嘴环路1000号恒生银行大厦15楼', 1, DATE_SUB(NOW(), INTERVAL 20 DAY), NOW()),
(@user3, '王五', '13800138003', '广东省', '广州市', '天河区', '天河路123号天河城购物中心', 1, DATE_SUB(NOW(), INTERVAL 60 DAY), NOW()),
(@user4, '赵六', '13800138004', '广东省', '深圳市', '南山区', '科技园南区深圳湾科技生态园10栋A座', 1, DATE_SUB(NOW(), INTERVAL 10 DAY), NOW()),
(@user5, '孙七', '13800138005', '浙江省', '杭州市', '西湖区', '文三路259号昌地火炬大厦1号楼', 1, DATE_SUB(NOW(), INTERVAL 45 DAY), NOW());

-- ============================================
-- 5. 插入订单数据
-- ============================================

-- 获取已售出商品ID
SET @goods_sold1 = (SELECT id FROM goods WHERE title = '小米 12S Ultra 256GB' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @goods_sold2 = (SELECT id FROM goods WHERE title = '联想 ThinkPad X1 Carbon' COLLATE utf8mb4_unicode_ci LIMIT 1);

INSERT INTO orders (order_no, goods_id, goods_title, goods_image, price, quantity, total_price, buyer_id, seller_id, status, create_time, pay_time, ship_time, complete_time) VALUES
('ORD20231110001', @goods_sold1, '小米 12S Ultra 256GB', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 3500.00, 1, 3500.00, @user4, @user3, 'completed', DATE_SUB(NOW(), INTERVAL 15 DAY), DATE_SUB(NOW(), INTERVAL 14 DAY), DATE_SUB(NOW(), INTERVAL 13 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY)),
('ORD20231110002', @goods_sold2, '联想 ThinkPad X1 Carbon', 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=400&h=400&fit=crop', 4500.00, 1, 4500.00, @user5, @user4, 'completed', DATE_SUB(NOW(), INTERVAL 12 DAY), DATE_SUB(NOW(), INTERVAL 11 DAY), DATE_SUB(NOW(), INTERVAL 10 DAY), DATE_SUB(NOW(), INTERVAL 8 DAY)),
('ORD20231110003', @goods_sold1, '小米 12S Ultra 256GB', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop', 3500.00, 1, 3500.00, @user1, @user3, 'paid', DATE_SUB(NOW(), INTERVAL 5 DAY), DATE_SUB(NOW(), INTERVAL 4 DAY), NULL, NULL);

-- ============================================
-- 6. 插入收藏数据
-- ============================================

-- 获取商品ID
SET @goods1 = (SELECT id FROM goods WHERE title = 'iPhone 13 Pro 256GB 深空灰色' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @goods2 = (SELECT id FROM goods WHERE title = 'MacBook Pro 14寸 M1 Pro芯片' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @goods3 = (SELECT id FROM goods WHERE title = '佳能 EOS R6 全画幅微单相机' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @goods4 = (SELECT id FROM goods WHERE title = 'AirPods Pro 2代 降噪耳机' COLLATE utf8mb4_unicode_ci LIMIT 1);
SET @goods5 = (SELECT id FROM goods WHERE title = '华为 Mate 50 Pro 512GB' COLLATE utf8mb4_unicode_ci LIMIT 1);

INSERT INTO favorites (user_id, goods_id, create_time) VALUES
(@user1, @goods2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@user1, @goods3, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@user2, @goods1, DATE_SUB(NOW(), INTERVAL 3 DAY)),
(@user2, @goods4, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(@user3, @goods5, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@user4, @goods1, DATE_SUB(NOW(), INTERVAL 4 DAY)),
(@user4, @goods2, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(@user5, @goods3, DATE_SUB(NOW(), INTERVAL 1 DAY));

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







