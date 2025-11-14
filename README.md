# 二手交易平台

一个基于 uni-app 开发的二手交易平台小程序，包含20+个页面，使用模拟数据进行展示。

## 项目结构

```
SkyMark/
├── pages/              # 页面目录
│   ├── index/          # 首页
│   ├── goods/          # 商品相关页面
│   │   ├── list.vue    # 商品列表
│   │   ├── detail.vue  # 商品详情
│   │   ├── publish.vue # 发布商品
│   │   ├── edit.vue    # 编辑商品
│   │   └── my.vue      # 我的商品
│   ├── user/           # 用户相关页面
│   │   ├── login.vue   # 登录
│   │   ├── register.vue # 注册
│   │   ├── profile.vue  # 个人中心
│   │   ├── edit.vue     # 编辑资料
│   │   └── favorites.vue # 我的收藏
│   ├── order/          # 订单相关页面
│   │   ├── list.vue    # 订单列表
│   │   └── detail.vue  # 订单详情
│   ├── message/        # 消息相关页面
│   │   ├── list.vue    # 消息列表
│   │   └── chat.vue    # 聊天页面
│   ├── category/       # 分类页面
│   ├── search/         # 搜索页面
│   ├── address/       # 地址管理
│   ├── settings/      # 设置页面
│   ├── about/          # 关于我们
│   ├── help/           # 帮助中心
│   └── feedback/       # 意见反馈
├── utils/              # 工具函数
│   └── mockData.js     # 模拟数据
├── components/         # 组件
│   └── icon/           # 图标组件
├── static/             # 静态资源
├── App.vue             # 应用入口
├── main.js             # 主入口文件
├── pages.json          # 页面配置
└── manifest.json       # 应用配置
```

## 页面列表（共24个页面）

1. **首页** - pages/index/index.vue
2. **商品列表** - pages/goods/list.vue
3. **商品详情** - pages/goods/detail.vue
4. **发布商品** - pages/goods/publish.vue
5. **编辑商品** - pages/goods/edit.vue
6. **我的商品** - pages/goods/my.vue
7. **商品分类** - pages/category/index.vue
8. **搜索页面** - pages/search/index.vue
9. **搜索结果** - pages/search/result.vue
10. **用户登录** - pages/user/login.vue
11. **用户注册** - pages/user/register.vue
12. **个人中心** - pages/user/profile.vue
13. **编辑资料** - pages/user/edit.vue
14. **我的收藏** - pages/user/favorites.vue
15. **订单列表** - pages/order/list.vue
16. **订单详情** - pages/order/detail.vue
17. **消息列表** - pages/message/list.vue
18. **聊天页面** - pages/message/chat.vue
19. **地址管理** - pages/address/list.vue
20. **编辑地址** - pages/address/edit.vue
21. **设置页面** - pages/settings/index.vue
22. **关于我们** - pages/about/index.vue
23. **帮助中心** - pages/help/index.vue
24. **意见反馈** - pages/feedback/index.vue

## 功能特性

- ✅ 商品浏览、搜索、分类
- ✅ 商品发布、编辑、管理
- ✅ 用户登录、注册、个人中心
- ✅ 订单管理
- ✅ 消息聊天
- ✅ 地址管理
- ✅ 收藏功能
- ✅ 设置和帮助

## 使用说明

### 安装依赖

如果使用 uni-ui 组件库（推荐），需要安装：

```bash
npm install @dcloudio/uni-ui
```


## 开发环境

- uni-app
- Vue 3
- 支持微信小程序、H5等多端运行





