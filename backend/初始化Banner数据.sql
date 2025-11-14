-- 初始化 Banner 数据
-- 使用后端静态资源路径（需要将图片放在 backend/src/main/resources/static/banner/ 目录下）

-- 方案1：使用本地 IP 地址（局域网访问）
-- 访问路径：http://10.1.23.38:8080/api/static/banner/1.png
INSERT INTO banners (image_url, title, link_url, sort_order, enabled, create_time, update_time) VALUES
('http://10.1.23.38:8080/api/static/banner/1.png', '新品上市，限时优惠', '/pages/goods/list?tag=new', 1, 1, NOW(), NOW()),
('http://10.1.23.38:8080/api/static/banner/2.png', '二手好物，等你来淘', '/pages/goods/list?tag=hot', 2, 1, NOW(), NOW()),
('http://10.1.23.38:8080/api/static/banner/3.png', '会员专享，积分兑换', '/pages/user/profile', 3, 1, NOW(), NOW()),
('http://10.1.23.38:8080/api/static/banner/4.png', '发布闲置，快速变现', '/pages/goods/publish', 4, 1, NOW(), NOW());

-- 如果使用 localhost（仅本机访问），可以使用：
-- INSERT INTO banners (image_url, title, link_url, sort_order, enabled, create_time, update_time) VALUES
-- ('http://localhost:8080/api/static/banner/1.png', '新品上市，限时优惠', '/pages/goods/list?tag=new', 1, 1, NOW(), NOW()),
-- ('http://localhost:8080/api/static/banner/2.png', '二手好物，等你来淘', '/pages/goods/list?tag=hot', 2, 1, NOW(), NOW()),
-- ('http://localhost:8080/api/static/banner/3.png', '会员专享，积分兑换', '/pages/user/profile', 3, 1, NOW(), NOW()),
-- ('http://localhost:8080/api/static/banner/4.png', '发布闲置，快速变现', '/pages/goods/publish', 4, 1, NOW(), NOW());

-- 如果使用 cpolar 公网地址，可以使用：
-- INSERT INTO banners (image_url, title, link_url, sort_order, enabled, create_time, update_time) VALUES
-- ('https://56b33ccb.r5.cpolar.top/api/static/banner/1.png', '新品上市，限时优惠', '/pages/goods/list?tag=new', 1, 1, NOW(), NOW()),
-- ('https://56b33ccb.r5.cpolar.top/api/static/banner/2.png', '二手好物，等你来淘', '/pages/goods/list?tag=hot', 2, 1, NOW(), NOW()),
-- ('https://56b33ccb.r5.cpolar.top/api/static/banner/3.png', '会员专享，积分兑换', '/pages/user/profile', 3, 1, NOW(), NOW()),
-- ('https://56b33ccb.r5.cpolar.top/api/static/banner/4.png', '发布闲置，快速变现', '/pages/goods/publish', 4, 1, NOW(), NOW());


