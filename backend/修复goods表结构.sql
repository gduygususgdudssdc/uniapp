-- ============================================
-- 修复 goods 表结构
-- ============================================

USE skymark;

-- 检查表是否存在
SHOW TABLES LIKE 'goods';

-- 如果表存在但结构不对，先删除（谨慎操作！）
-- DROP TABLE IF EXISTS goods;

-- 创建 goods 表（确保 condition 字段使用反引号）
CREATE TABLE IF NOT EXISTS goods (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL COMMENT '商品标题',
    price DECIMAL(10, 2) NOT NULL COMMENT '售价',
    original_price DECIMAL(10, 2) COMMENT '原价',
    images TEXT COMMENT '商品图片（JSON数组）',
    category_id BIGINT COMMENT '分类ID',
    category_name VARCHAR(50) COMMENT '分类名称',
    description TEXT COMMENT '商品描述',
    seller_id BIGINT NOT NULL COMMENT '卖家ID',
    location VARCHAR(200) COMMENT '所在地区',
    `condition` VARCHAR(20) COMMENT '成色',
    views INT DEFAULT 0 COMMENT '浏览次数',
    likes INT DEFAULT 0 COMMENT '收藏数',
    status VARCHAR(20) DEFAULT 'onSale' COMMENT '状态：onSale已上架, sold已售出, offShelf已下架',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    INDEX idx_seller_id (seller_id),
    INDEX idx_category_id (category_id),
    INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

-- 验证表结构
DESCRIBE goods;

-- 查看表结构（确认 condition 字段）
SHOW CREATE TABLE goods;







