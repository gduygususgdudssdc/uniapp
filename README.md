
---

## 🎯 功能模块

### 1. 用户模块

**功能**：
- ✅ 用户注册/登录
- ✅ 微信快捷登录
- ✅ 个人信息管理
- ✅ 头像上传
- ✅ 密码修改

**页面**：
- `pages/user/login.vue` - 登录
- `pages/user/register.vue` - 注册
- `pages/user/profile.vue` - 个人中心
- `pages/user/edit.vue` - 编辑资料

**API**：
- `POST /user/register` - 注册
- `POST /user/login` - 登录
- `POST /user/wechat/login` - 微信登录
- `GET /user/{id}` - 获取用户信息
- `PUT /user/{id}` - 更新用户信息

### 2. 商品模块

**功能**：
- ✅ 商品浏览（列表、详情）
- ✅ 商品搜索
- ✅ 商品分类
- ✅ 商品发布
- ✅ 商品编辑
- ✅ 我的商品管理

**页面**：
- `pages/index/index.vue` - 首页（轮播图、商品推荐）
- `pages/goods/list.vue` - 商品列表
- `pages/goods/detail.vue` - 商品详情
- `pages/goods/publish.vue` - 发布商品
- `pages/goods/edit.vue` - 编辑商品
- `pages/goods/my.vue` - 我的商品
- `pages/category/index.vue` - 商品分类
- `pages/search/index.vue` - 搜索页面
- `pages/search/result.vue` - 搜索结果

**API**：
- `GET /goods/list` - 获取商品列表
- `GET /goods/search` - 搜索商品
- `GET /goods/{id}` - 获取商品详情
- `POST /goods/create` - 创建商品
- `PUT /goods/{id}` - 更新商品
- `DELETE /goods/{id}` - 删除商品
- `GET /goods/my/{sellerId}` - 我的商品

### 3. 订单模块

**功能**：
- ✅ 创建订单
- ✅ 订单列表
- ✅ 订单详情
- ✅ 订单支付
- ✅ 订单取消

**页面**：
- `pages/order/list.vue` - 订单列表
- `pages/order/detail.vue` - 订单详情

**API**：
- `POST /order/create` - 创建订单
- `GET /order/{id}` - 获取订单详情
- `GET /order/list/{userId}` - 获取订单列表
- `POST /order/pay/{id}` - 支付订单
- `POST /order/cancel/{id}` - 取消订单

### 4. 消息模块（WebSocket）

**功能**：
- ✅ 实时聊天
- ✅ 消息列表
- ✅ 消息已读/未读
- ✅ 未读消息统计

**页面**：
- `pages/message/list.vue` - 消息列表
- `pages/message/chat.vue` - 聊天页面

**API**：
- `POST /message/send` - 发送消息（HTTP 备用）
- `GET /message/chat` - 获取聊天记录
- `GET /message/list/{userId}` - 获取消息列表
- `POST /message/read` - 标记已读
- `GET /message/unread/{userId}` - 获取未读数

**WebSocket**：
- `ws://host:port/api/ws/chat?userId={userId}` - WebSocket 连接

### 5. 地址模块

**功能**：
- ✅ 地址列表
- ✅ 添加地址
- ✅ 编辑地址
- ✅ 删除地址
- ✅ 设置默认地址

**页面**：
- `pages/address/list.vue` - 地址列表
- `pages/address/edit.vue` - 编辑地址

**API**：
- `GET /address/list/{userId}` - 获取地址列表
- `POST /address/add` - 添加地址
- `PUT /address/{id}` - 更新地址
- `DELETE /address/{id}` - 删除地址
- `POST /address/setDefault/{id}` - 设置默认地址

### 6. 收藏模块

**功能**：
- ✅ 添加收藏
- ✅ 取消收藏
- ✅ 收藏列表
- ✅ 检查是否收藏

**页面**：
- `pages/user/favorites.vue` - 我的收藏

**API**：
- `POST /favorite/add` - 添加收藏
- `POST /favorite/remove` - 取消收藏
- `GET /favorite/check` - 检查是否收藏
- `GET /favorite/list/{userId}` - 获取收藏列表
- `GET /favorite/count/{userId}` - 获取收藏数量

### 7. 其他模块

**轮播图**：
- `GET /banner/list` - 获取轮播图列表
- `GET /banner/{id}` - 获取轮播图详情
- `POST /banner/create` - 创建轮播图

**分类**：
- `GET /category/list` - 获取分类列表
- `GET /category/{id}` - 获取分类详情

**其他页面**：
- `pages/settings/index.vue` - 设置
- `pages/about/index.vue` - 关于我们
- `pages/help/index.vue` - 帮助中心
- `pages/feedback/index.vue` - 意见反馈

---

## 🗄️ 数据库设计

### 核心表结构

#### 1. users（用户表）
- id (BIGINT, PRIMARY KEY)
- username (VARCHAR) - 用户名
- password (VARCHAR) - 密码（MD5加密）
- phone (VARCHAR) - 手机号
- avatar (VARCHAR) - 头像URL
- create_time (DATETIME) - 创建时间#### 2. goods（商品表）
- id (BIGINT, PRIMARY KEY)
- seller_id (BIGINT) - 卖家ID
- category_id (BIGINT) - 分类ID
- title (VARCHAR) - 商品标题
- description (TEXT) - 商品描述
- price (DECIMAL) - 价格
- images (TEXT) - 图片URLs（JSON）
- status (VARCHAR) - 状态（上架/下架）
- create_time (DATETIME) - 创建时间#### 3. orders（订单表）
- id (BIGINT, PRIMARY KEY)
- buyer_id (BIGINT) - 买家ID
- seller_id (BIGINT) - 卖家ID
- goods_id (BIGINT) - 商品ID
- address_id (BIGINT) - 地址ID
- total_price (DECIMAL) - 总价
- status (VARCHAR) - 订单状态
- create_time (DATETIME) - 创建时间#### 4. messages（消息表）
- id (BIGINT, PRIMARY KEY)
- sender_id (BIGINT) - 发送者ID
- receiver_id (BIGINT) - 接收者ID
- content (VARCHAR) - 消息内容
- is_read (BOOLEAN) - 是否已读
- create_time (DATETIME) - 创建时间#### 5. addresses（地址表）
- id (BIGINT, PRIMARY KEY)
- user_id (BIGINT) - 用户ID
- name (VARCHAR) - 收货人姓名
- phone (VARCHAR) - 手机号
- province (VARCHAR) - 省份
- city (VARCHAR) - 城市
- district (VARCHAR) - 区县
- detail (VARCHAR) - 详细地址
- is_default (BOOLEAN) - 是否默认#### 6. favorites（收藏表）
- id (BIGINT, PRIMARY KEY)
- user_id (BIGINT) - 用户ID
- goods_id (BIGINT) - 商品ID
- create_time (DATETIME) - 创建时间#### 7. categories（分类表）
- id (BIGINT, PRIMARY KEY)
- name (VARCHAR) - 分类名称
- icon (VARCHAR) - 图标URL
- sort_order (INT) - 排序#### 8. banners（轮播图表）
- id (BIGINT, PRIMARY KEY)
- image_url (VARCHAR) - 图片URL
- title (VARCHAR) - 标题
- link_url (VARCHAR) - 链接URL
- sort_order (INT) - 排序
- enabled (BOOLEAN) - 是否启用---

## 🚀 快速开始

### 环境要求

**前端**：
- Node.js 14+
- HBuilderX 或 Vite
- 微信开发者工具（小程序开发）

**后端**：
- JDK 11+
- Maven 3.6+
- MySQL 8.0+

### 后端启动

1. **创建数据库**
CREATE DATABASE skymark CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;2. **配置数据库**
编辑 `backend/src/main/resources/application.yml`：
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/skymark?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password3. **启动后端**
cd backend
mvn spring-boot:run
后端服务运行在：`http://localhost:8080/api`

### 前端启动

1. **安装依赖**（如果需要）
npm install @dcloudio/uni-ui2. **配置 API 地址**
编辑 `utils/api.config.js`：
export const API_BASE_URL = 'http://localhost:8080/api'
// 或使用局域网IP：'http://10.1.23.38:8080/api'3. **运行项目**
- **H5**：在 HBuilderX 中运行到浏览器
- **微信小程序**：在 HBuilderX 中运行到微信开发者工具

---

## 📡 API 接口文档

### 统一响应格式

{
  "code": 200,
  "message": "成功",
  "data": {}
}### 用户相关接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/user/register` | 用户注册 |
| POST | `/user/login` | 用户登录 |
| POST | `/user/wechat/login` | 微信登录 |
| GET | `/user/{id}` | 获取用户信息 |
| PUT | `/user/{id}` | 更新用户信息 |
| POST | `/user/{id}/avatar/upload` | 上传头像 |

### 商品相关接口

| 方法 | 路径 | 说明 |
|------|------|------|
| GET | `/goods/list` | 获取商品列表 |
| GET | `/goods/search` | 搜索商品 |
| GET | `/goods/{id}` | 获取商品详情 |
| POST | `/goods/create` | 创建商品 |
| PUT | `/goods/{id}` | 更新商品 |
| DELETE | `/goods/{id}` | 删除商品 |
| GET | `/goods/my/{sellerId}` | 我的商品 |

### 订单相关接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/order/create` | 创建订单 |
| GET | `/order/{id}` | 获取订单详情 |
| GET | `/order/list/{userId}` | 获取订单列表 |
| POST | `/order/pay/{id}` | 支付订单 |
| POST | `/order/cancel/{id}` | 取消订单 |

### 消息相关接口

| 方法 | 路径 | 说明 |
|------|------|------|
| POST | `/message/send` | 发送消息（HTTP备用） |
| GET | `/message/chat` | 获取聊天记录 |
| GET | `/message/list/{userId}` | 获取消息列表 |
| POST | `/message/read` | 标记已读 |
| GET | `/message/unread/{userId}` | 获取未读数 |

**WebSocket**：
- 连接地址：`ws://host:port/api/ws/chat?userId={userId}`
- 消息格式：见 `WebSocket聊天功能实现说明.md`

### 其他接口

**地址**：`/address/*`
**收藏**：`/favorite/*`
**分类**：`/category/*`
**轮播图**：`/banner/*`

---

## 🔌 WebSocket 实时聊天

### 连接方式

// 前端连接
wsManager.connect(userId, onMessage, onError)

// 连接URL
ws://host:port/api/ws/chat?userId={userId}### 消息类型

**发送消息**：n
{
  "type": "SEND",
  "senderId": 1,
  "receiverId": 2,
  "content": "你好"
}**接收消息**：
{
  "type": "MESSAGE",
  "id": 123,
  "senderId": 1,
  "receiverId": 2,
  "content": "你好",
  "isRead": false,
  "createTime": "2025-11-14T21:30:00"
}**标记已读**：
{
  "type": "READ",
  "senderId": 1,
  "receiverId": 2
}详细说明请参考：`WebSocket聊天功能实现说明.md`

---

## 🎨 前端页面列表（24个）

1. **首页** - `pages/index/index.vue`
2. **商品列表** - `pages/goods/list.vue`
3. **商品详情** - `pages/goods/detail.vue`
4. **发布商品** - `pages/goods/publish.vue`
5. **编辑商品** - `pages/goods/edit.vue`
6. **我的商品** - `pages/goods/my.vue`
7. **商品分类** - `pages/category/index.vue`
8. **搜索页面** - `pages/search/index.vue`
9. **搜索结果** - `pages/search/result.vue`
10. **用户登录** - `pages/user/login.vue`
11. **用户注册** - `pages/user/register.vue`
12. **个人中心** - `pages/user/profile.vue`
13. **编辑资料** - `pages/user/edit.vue`
14. **我的收藏** - `pages/user/favorites.vue`
15. **订单列表** - `pages/order/list.vue`
16. **订单详情** - `pages/order/detail.vue`
17. **消息列表** - `pages/message/list.vue`
18. **聊天页面** - `pages/message/chat.vue`
19. **地址管理** - `pages/address/list.vue`
20. **编辑地址** - `pages/address/edit.vue`
21. **设置页面** - `pages/settings/index.vue`
22. **关于我们** - `pages/about/index.vue`
23. **帮助中心** - `pages/help/index.vue`
24. **意见反馈** - `pages/feedback/index.vue`

---

## 🔧 配置说明

### 前端配置

**API 配置** (`utils/api.config.js`)：pt
// 本地开发
export const API_BASE_URL = 'http://localhost:8080/api'

// 局域网
export const API_BASE_URL = 'http://10.1.23.38:8080/api'

// Cpolar 公网
export const API_BASE_URL = 'https://your-domain.cpolar.cn/api'### 后端配置

**application.yml**：ml
server:
  port: 8080
  servlet:
    context-path: /api

spring:
  datasource:
    url: jdbc:mysql://localhost:3306/skymark?...
    username: root
    password: your_password
  
  jpa:
    hibernate:
      ddl-auto: update  # 自动创建/更新表结构---

## 📦 部署说明

### 后端部署

1. **打包**
cd backend
mvn clean package2. **运行**
java -jar target/skymark-backend-0.0.1-SNAPSHOT.jar3. **使用 Cpolar 暴露公网**（可选）sh
cpolar http 8080### 前端部署

**H5**：
- 在 HBuilderX 中发行 → H5
- 上传到服务器或静态托管

**微信小程序**：
- 在 HBuilderX 中发行 → 小程序-微信
- 上传到微信公众平台

---

## 🐛 常见问题

### 1. WebSocket 连接失败

**问题**：连接返回 404

**解决**：
- 检查后端是否启动
- 确认路径：`ws://host:port/api/ws/chat?userId={userId}`
- 检查 `context-path` 配置

### 2. 跨域问题

**解决**：后端已配置 CORS，允许所有来源

### 3. 数据库连接失败

**解决**：
- 检查 MySQL 是否启动
- 确认数据库名称、用户名、密码
- 检查数据库是否存在

### 4. 图片无法显示

**问题**：真机上图片不显示

**解决**：
- 使用 HTTP/HTTPS URL，不要使用本地路径
- 使用 Cpolar 或内网穿透工具暴露静态资源

---

## 📝 开发规范

### 代码规范

- **前端**：遵循 Vue 3 Composition API 规范
- **后端**：遵循 Spring Boot 最佳实践
- **命名**：使用驼峰命名法
- **注释**：关键功能添加注释


