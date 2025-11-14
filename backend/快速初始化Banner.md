# 快速初始化 Banner 数据

## 方法1：使用 SQL 脚本（推荐）

1. **打开数据库管理工具**（如 Navicat、MySQL Workbench、DBeaver 等）

2. **连接到数据库** `skymark`

3. **执行 SQL 脚本**
   ```sql
   -- 复制 backend/初始化Banner数据.sql 中的内容并执行
   INSERT INTO banners (image_url, title, link_url, sort_order, enabled, create_time, update_time) VALUES
   ('http://10.1.23.38:8080/api/static/banner/1.png', '新品上市，限时优惠', '/pages/goods/list?tag=new', 1, 1, NOW(), NOW()),
   ('http://10.1.23.38:8080/api/static/banner/2.png', '二手好物，等你来淘', '/pages/goods/list?tag=hot', 2, 1, NOW(), NOW()),
   ('http://10.1.23.38:8080/api/static/banner/3.png', '会员专享，积分兑换', '/pages/user/profile', 3, 1, NOW(), NOW()),
   ('http://10.1.23.38:8080/api/static/banner/4.png', '发布闲置，快速变现', '/pages/goods/publish', 4, 1, NOW(), NOW());
   ```

4. **验证数据**
   - 访问：`http://10.1.23.38:8080/api/banner/list`
   - 应该返回 4 条 banner 数据

## 方法2：使用 API 接口（快速）

1. **使用 Postman 或浏览器**访问：
   ```
   POST http://10.1.23.38:8080/api/banner/init
   ```

2. **或者使用 curl 命令**：
   ```bash
   curl -X POST http://10.1.23.38:8080/api/banner/init
   ```

3. **验证数据**
   - 访问：`http://10.1.23.38:8080/api/banner/list`
   - 应该返回 4 条 banner 数据

## 注意事项

- 确保图片文件已放在 `backend/src/main/resources/static/banner/` 目录下
- 如果使用不同的 IP 地址，需要修改 SQL 脚本中的 URL
- 如果使用 cpolar 公网地址，需要修改 SQL 脚本中的 URL 为 cpolar 地址

## 检查数据

执行以下 SQL 查询，检查 banner 数据：
```sql
SELECT * FROM banners;
```

应该看到 4 条记录，每条记录的 `enabled` 字段为 `1`（true）。



