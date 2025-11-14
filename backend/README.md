# SkyMark 后端服务

## 项目简介

这是二手交易平台的后端服务，基于 Spring Boot + MySQL + JPA 开发。

## 技术栈

- Spring Boot 2.7.18
- Spring Data JPA
- MySQL 8.0+
- Lombok
- Maven

## 快速开始

### 1. 环境要求

- JDK 11 或更高版本
- Maven 3.6+
- MySQL 8.0+

### 2. 数据库配置

1. 创建数据库：
```sql
CREATE DATABASE skymark CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

2. 修改 `application.yml` 中的数据库连接信息：
```yaml
spring:
  datasource:
    url: jdbc:mysql://localhost:3306/skymark?useUnicode=true&characterEncoding=utf8&useSSL=false&serverTimezone=Asia/Shanghai
    username: root
    password: your_password
```

### 3. 运行项目

```bash
# 使用 Maven 运行
mvn spring-boot:run

# 或者打包后运行
mvn clean package
java -jar target/skymark-backend-0.0.1-SNAPSHOT.jar
```

### 4. 访问接口

- API 基础路径：`http://localhost:8080/api`
- 例如：`http://localhost:8080/api/user/login`

## API 接口

### 用户相关
- `POST /user/register` - 用户注册
- `POST /user/login` - 用户登录
- `GET /user/{id}` - 获取用户信息
- `PUT /user/{id}` - 更新用户信息

### 商品相关
- `GET /goods/list` - 获取商品列表
- `GET /goods/search` - 搜索商品
- `GET /goods/{id}` - 获取商品详情
- `POST /goods/create` - 创建商品
- `PUT /goods/{id}` - 更新商品
- `DELETE /goods/{id}` - 删除商品

### 订单相关
- `POST /order/create` - 创建订单
- `GET /order/{id}` - 获取订单详情
- `GET /order/list/{userId}` - 获取订单列表
- `POST /order/pay/{id}` - 支付订单
- `POST /order/cancel/{id}` - 取消订单

### 分类相关
- `GET /category/list` - 获取分类列表

### 地址相关
- `GET /address/list/{userId}` - 获取地址列表
- `POST /address/add` - 添加地址
- `PUT /address/{id}` - 更新地址
- `DELETE /address/{id}` - 删除地址
- `POST /address/setDefault/{id}` - 设置默认地址

## 项目结构

```
backend/
├── src/
│   ├── main/
│   │   ├── java/com/skymark/
│   │   │   ├── BackendApplication.java
│   │   │   ├── common/          # 公共类
│   │   │   ├── config/          # 配置类
│   │   │   ├── controller/      # 控制器
│   │   │   ├── entity/          # 实体类
│   │   │   ├── repository/      # 数据访问层
│   │   │   ├── service/         # 服务层
│   │   │   └── exception/       # 异常处理
│   │   └── resources/
│   │       └── application.yml
│   └── test/
└── pom.xml
```

## 注意事项

1. 数据库表会自动创建（`ddl-auto: update`）
2. 密码使用 MD5 加密存储
3. 已配置跨域，允许前端访问
4. 所有接口返回统一格式：`{code, message, data}`

## 开发建议

1. 生产环境需要添加 JWT 认证
2. 图片上传建议使用对象存储服务（OSS）
3. 添加接口文档（Swagger）
4. 添加单元测试








