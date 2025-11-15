# WebSocket 实时聊天功能实现说明

## 📋 功能概述

本系统实现了基于 WebSocket 的实时聊天功能，支持：
- ✅ 实时双向通信（无需轮询）
- ✅ 消息持久化存储
- ✅ 消息已读/未读状态
- ✅ 自动重连机制
- ✅ 多用户在线管理

---

## 🏗️ 整体架构

```
┌─────────────────┐         WebSocket          ┌─────────────────┐
│   前端 (Uni-app) │ ◄──────────────────────► │  后端 (Spring)   │
│                 │                           │                 │
│  websocket.js   │                           │ ChatWebSocket   │
│  chat.vue       │                           │ Handler         │
└─────────────────┘                           └─────────────────┘
                                                       │
                                                       ▼
                                              ┌─────────────────┐
                                              │   MySQL 数据库  │
                                              │   messages 表   │
                                              └─────────────────┘
```

---

## 🔧 技术栈

### 后端
- **Spring Boot** + **Spring WebSocket**
- **JPA/Hibernate** - 数据持久化
- **MySQL** - 消息存储
- **Jackson** - JSON 序列化（支持 Java 8 时间类型）

### 前端
- **Uni-app** - 跨平台框架
- **原生 WebSocket API** (H5) / **uni.connectSocket** (小程序)
- **Vue 3 Composition API**

---

## 📦 核心组件

### 1. 后端组件

#### 1.1 数据库实体 (`Message.java`)
```java
@Entity
@Table(name = "messages")
public class Message {
    private Long id;
    private Long senderId;      // 发送者ID
    private Long receiverId;     // 接收者ID
    private String content;      // 消息内容
    private Boolean isRead;      // 是否已读
    private LocalDateTime createTime; // 创建时间
}
```

#### 1.2 WebSocket 配置 (`WebSocketConfig.java`)
- **作用**：注册 WebSocket 处理器和拦截器
- **路径**：`/ws/chat`（实际访问：`ws://host:port/api/ws/chat`）
- **特性**：
  - 支持跨域 (`setAllowedOrigins("*")`)
  - 添加拦截器用于身份验证

#### 1.3 WebSocket 处理器 (`ChatWebSocketHandler.java`)
**核心功能**：

1. **连接管理**
   ```java
   // 存储在线用户会话
   private Map<Long, WebSocketSession> userSessions = new ConcurrentHashMap<>();
   
   // 连接建立时
   - 从 URL 参数获取 userId
   - 如果用户已连接，关闭旧连接
   - 存储新会话到 Map
   ```

2. **消息处理**
   ```java
   // 接收消息类型
   - "SEND": 发送消息
   - "READ": 标记已读
   
   // 处理流程
   1. 解析 JSON 消息
   2. 保存到数据库
   3. 推送给发送者和接收者
   ```

3. **消息推送**
   ```java
   // 发送给指定用户
   - 查找用户的 WebSocketSession
   - 检查连接是否打开
   - 发送 JSON 消息
   - 如果失败，移除失效会话
   ```

#### 1.4 消息服务 (`MessageService.java`)
- `sendMessage()` - 发送消息并保存到数据库
- `getChatMessages()` - 获取两个用户之间的聊天记录
- `getMessageList()` - 获取用户的消息列表（显示所有对话）
- `markMessagesAsRead()` - 标记消息为已读
- `getUnreadCount()` - 获取未读消息数量

---

### 2. 前端组件

#### 2.1 WebSocket 管理器 (`utils/websocket.js`)
**核心类：`WebSocketManager`**

**主要方法**：

1. **`connect(userId, onMessage, onError)`**
   ```javascript
   // 连接流程
   1. 检查是否已有连接（避免重复连接）
   2. 构建 WebSocket URL: ws://host:port/api/ws/chat?userId=xxx
   3. 优先使用原生 WebSocket（H5 环境）
   4. 降级到 uni.connectSocket（小程序环境）
   5. 设置事件监听器
   ```

2. **`send(type, data)`**
   ```javascript
   // 发送消息
   - 检查连接状态
   - 构建消息对象 { type, ...data }
   - 序列化为 JSON
   - 通过 WebSocket 发送
   ```

3. **`setupNativeWebSocket()`**
   ```javascript
   // 原生 WebSocket 事件处理
   - onopen: 连接成功，重置重连计数
   - onmessage: 接收消息，调用回调函数
   - onerror: 连接错误
   - onclose: 连接关闭
     - 正常关闭（1000/1001）：不重连
     - 异常关闭：自动重连
   ```

4. **`scheduleReconnect()`**
   ```javascript
   // 自动重连机制
   - 最大重连次数：5 次
   - 重连间隔：3 秒
   - 重置 socket，重新创建连接
   ```

#### 2.2 聊天页面 (`pages/message/chat.vue`)
**核心功能**：

1. **页面加载**
   ```javascript
   onLoad() {
     - 获取对方用户ID
     - 加载聊天记录（HTTP API）
     - 连接 WebSocket
   }
   ```

2. **发送消息**
   ```javascript
   sendMessage() {
     // WebSocket 发送
     1. 通过 WebSocket 发送消息
     2. 如果失败，使用 HTTP 备用方案
     
     // 服务器确认后显示
     3. 收到服务器消息后，添加到消息列表
     4. 滚动到底部
   }
   ```

3. **接收消息**
   ```javascript
   handleWebSocketMessage(data) {
     switch (data.type) {
       case "MESSAGE":
         - 检查消息是否已存在（避免重复）
         - 添加到消息列表
         - 滚动到底部
         - 标记为已读
         break
       case "ERROR":
         - 显示错误提示
         break
     }
   }
   ```

4. **生命周期管理**
   ```javascript
   onShow() {
     - 如果未连接，重新连接 WebSocket
   }
   
   onHide() {
     - 保持连接（不立即断开）
   }
   
   onUnmounted() {
     - 断开 WebSocket 连接
   }
   ```

---

## 🔄 消息流程

### 发送消息流程

```
用户A输入消息
    │
    ▼
通过 WebSocket 发送
    │
    ▼
后端接收消息
    │
    ├─► 保存到数据库
    │
    ├─► 推送给用户A（确认，前端显示）
    │
    └─► 推送给用户B（如果在线）
```

### 接收消息流程

```
后端收到消息
    │
    ├─► 保存到数据库
    │
    └─► 查找接收者会话
        │
        ├─► 在线：通过 WebSocket 推送
        │
        └─► 离线：下次连接时通过 HTTP API 获取
```

---

## 🔐 连接管理

### 连接建立

1. **前端发起连接**
   ```
   ws://10.1.23.38:8080/api/ws/chat?userId=1
   ```

2. **后端处理**
   - 从 URL 参数提取 `userId`
   - 验证用户是否存在
   - 如果用户已连接，关闭旧连接
   - 存储新会话到 `userSessions` Map

3. **连接成功**
   - 前端：`onopen` 事件触发
   - 后端：日志输出 "✓ 用户 X 已成功连接"

### 连接断开

**正常断开（代码 1000）**
- 用户主动关闭页面
- 后端主动关闭（如用户重新连接）
- **不触发重连**

**异常断开（其他代码）**
- 网络错误
- 服务器错误
- **自动重连（最多 5 次）**

---

## 📊 数据格式

### WebSocket 消息格式

**发送消息**
```json
{
  "type": "SEND",
  "senderId": 1,
  "receiverId": 2,
  "content": "你好"
}
```

**接收消息**
```json
{
  "type": "MESSAGE",
  "id": 123,
  "senderId": 1,
  "receiverId": 2,
  "content": "你好",
  "isRead": false,
  "createTime": "2025-11-14T21:30:00"
}
```

**标记已读**
```json
{
  "type": "READ",
  "senderId": 1,
  "receiverId": 2
}
```

**错误消息**
```json
{
  "type": "ERROR",
  "content": "发送消息失败: 接收者不存在"
}
```

---

## 🛠️ 关键技术点

### 1. 时间序列化

**问题**：Java 8 `LocalDateTime` 无法直接序列化为 JSON

**解决方案**：
```java
// 添加依赖
jackson-datatype-jsr310

// 配置 ObjectMapper
objectMapper.registerModule(new JavaTimeModule());
objectMapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
```

### 2. 连接路径配置

**问题**：Spring Boot `context-path=/api` 影响 WebSocket 路径

**解决方案**：
- 注册路径：`/ws/chat`
- 实际访问：`ws://host:port/api/ws/chat`
- Spring 自动添加 `context-path`

### 3. 消息显示

**实现**：
```javascript
// 1. 发送到服务器
wsManager.send('SEND', { ... })

// 2. 收到服务器确认后显示
// 服务器会推送消息给发送者和接收者
handleWebSocketMessage(data) {
  if (data.type === 'MESSAGE') {
    chatMessages.value.push(data)
  }
}
```

### 4. 重复消息处理

**问题**：WebSocket 可能重复推送消息

**解决方案**：
```javascript
// 检查消息是否已存在
const exists = chatMessages.value.some(msg => msg.id === data.id)
if (!exists) {
  chatMessages.value.push(data)
}
```

### 5. 自动重连策略

**策略**：
- 正常关闭（1000/1001）：不重连
- 异常关闭：自动重连
- 最大重连次数：5 次
- 重连间隔：3 秒

---

## 🐛 常见问题

### 1. 连接立即关闭（代码 1000）

**原因**：
- 后端未找到用户ID
- 页面切换导致断开

**解决**：
- 检查 URL 参数是否正确
- 优化页面生命周期管理

### 2. 消息无法实时接收

**原因**：
- WebSocket 未连接
- 用户不在线

**解决**：
- 检查连接状态
- 使用 HTTP API 作为备用方案

### 3. 重复连接

**原因**：
- 页面多次调用 `connect()`

**解决**：
- 添加连接状态检查
- 检查 `readyState`

---

## 📈 性能优化

1. **连接复用**：同一用户只保持一个连接
2. **消息去重**：检查消息ID避免重复显示
3. **HTTP 备用**：WebSocket 失败时使用 HTTP API
4. **自动重连**：网络恢复后自动连接
5. **服务器确认**：消息发送后等待服务器确认再显示

---

## 🔍 调试技巧

### 前端日志
```javascript
console.log('=== WebSocket 连接信息 ===')
console.log('完整 WebSocket URL:', wsUrl)
console.log('用户ID:', userId)
```

### 后端日志
```java
System.out.println("=== WebSocket 连接建立 ===")
System.out.println("当前在线用户: " + userSessions.keySet())
System.out.println("✓ 消息已成功发送给用户 " + userId)
```

---

## 📝 总结

本系统实现了完整的 WebSocket 实时聊天功能，包括：

✅ **实时通信**：基于 WebSocket 的双向通信
✅ **消息持久化**：所有消息保存到数据库
✅ **状态管理**：已读/未读状态跟踪
✅ **连接管理**：自动重连、连接复用
✅ **错误处理**：完善的错误提示和处理机制

整个系统采用前后端分离架构，通过 WebSocket 实现实时通信，HTTP API 作为备用方案，确保功能的稳定性和可靠性。

