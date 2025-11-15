"use strict";
const mockData = {
  // 用户数据
  users: [
    {
      id: 1,
      username: "小明",
      avatar: "https://i.pravatar.cc/150?img=12",
      phone: "138****8888",
      email: "xiaoming@example.com",
      address: "北京市朝阳区",
      level: "V1",
      score: 120
    },
    {
      id: 2,
      username: "小红",
      avatar: "https://i.pravatar.cc/150?img=47",
      phone: "139****9999",
      email: "xiaohong@example.com",
      address: "上海市浦东新区",
      level: "V2",
      score: 350
    }
  ],
  // 商品分类
  categories: [
    { id: 1, name: "数码电子", icon: "📱", children: [
      { id: 11, name: "手机" },
      { id: 12, name: "电脑" },
      { id: 13, name: "相机" },
      { id: 14, name: "耳机" }
    ] },
    { id: 2, name: "服装配饰", icon: "👔", children: [
      { id: 21, name: "男装" },
      { id: 22, name: "女装" },
      { id: 23, name: "鞋帽" },
      { id: 24, name: "箱包" }
    ] },
    { id: 3, name: "家具家电", icon: "🛋️", children: [
      { id: 31, name: "家具" },
      { id: 32, name: "家电" },
      { id: 33, name: "厨具" }
    ] },
    { id: 4, name: "图书文具", icon: "📚", children: [
      { id: 41, name: "图书" },
      { id: 42, name: "文具" }
    ] },
    { id: 5, name: "运动户外", icon: "⚽", children: [
      { id: 51, name: "运动器材" },
      { id: 52, name: "户外用品" }
    ] },
    { id: 6, name: "美妆护肤", icon: "💄", children: [
      { id: 61, name: "化妆品" },
      { id: 62, name: "护肤品" }
    ] },
    { id: 7, name: "其他", icon: "📦", children: [] }
  ],
  // 商品数据
  goods: [
    {
      id: 1,
      title: "iPhone 13 Pro 256GB 深空灰色",
      price: 6800,
      originalPrice: 8799,
      images: [
        "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&h=400&fit=crop"
      ],
      categoryId: 11,
      categoryName: "手机",
      description: "自用iPhone 13 Pro，256GB深空灰色，95新，无拆修，功能完好，原装充电器数据线都在，有意者联系。",
      seller: {
        id: 1,
        username: "小明",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      location: "北京市朝阳区",
      condition: "95新",
      views: 356,
      likes: 28,
      status: "onSale",
      createTime: "2024-01-15 10:30:00",
      isLiked: false
    },
    {
      id: 2,
      title: "MacBook Pro 13寸 M1芯片 512GB",
      price: 8500,
      originalPrice: 11999,
      images: [
        "https://images.unsplash.com/photo-1541807084-5c52b6b3fef6?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop"
      ],
      categoryId: 12,
      categoryName: "电脑",
      description: "MacBook Pro 13寸，M1芯片，512GB存储，98新，几乎全新，包装盒配件齐全，因换新电脑出。",
      seller: {
        id: 2,
        username: "小红",
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      location: "上海市浦东新区",
      condition: "98新",
      views: 523,
      likes: 45,
      status: "onSale",
      createTime: "2024-01-14 15:20:00",
      isLiked: true
    },
    {
      id: 3,
      title: "Nike Air Max 270 运动鞋 42码",
      price: 380,
      originalPrice: 899,
      images: [
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
        "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop"
      ],
      categoryId: 23,
      categoryName: "鞋帽",
      description: "Nike Air Max 270，42码，9成新，只穿过几次，原盒包装都在，正品保证。",
      seller: {
        id: 1,
        username: "小明",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      location: "北京市朝阳区",
      condition: "9成新",
      views: 189,
      likes: 12,
      status: "onSale",
      createTime: "2024-01-13 09:15:00",
      isLiked: false
    },
    {
      id: 4,
      title: "佳能 EOS R6 全画幅微单相机",
      price: 12800,
      originalPrice: 15999,
      images: [
        "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop"
      ],
      categoryId: 13,
      categoryName: "相机",
      description: "佳能EOS R6全画幅微单，使用一年，9成新，快门次数约8000次，无任何问题，镜头另售。",
      seller: {
        id: 2,
        username: "小红",
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      location: "上海市浦东新区",
      condition: "9成新",
      views: 267,
      likes: 33,
      status: "onSale",
      createTime: "2024-01-12 14:45:00",
      isLiked: false
    },
    {
      id: 5,
      title: "AirPods Pro 第二代 主动降噪",
      price: 1200,
      originalPrice: 1899,
      images: [
        "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=400&h=400&fit=crop"
      ],
      categoryId: 14,
      categoryName: "耳机",
      description: "AirPods Pro第二代，95新，使用半年，主动降噪功能完好，配件齐全，包装盒在。",
      seller: {
        id: 1,
        username: "小明",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      location: "北京市朝阳区",
      condition: "95新",
      views: 412,
      likes: 67,
      status: "sold",
      createTime: "2024-01-11 11:20:00",
      isLiked: true
    },
    {
      id: 6,
      title: "原木实木书桌 1.2米",
      price: 580,
      originalPrice: 1200,
      images: [
        "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop"
      ],
      categoryId: 31,
      categoryName: "家具",
      description: "原木实木书桌，1.2米长，8成新，质量很好，搬家转让，需自提。",
      seller: {
        id: 2,
        username: "小红",
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      location: "上海市浦东新区",
      condition: "8成新",
      views: 145,
      likes: 8,
      status: "onSale",
      createTime: "2024-01-10 16:30:00",
      isLiked: false
    },
    {
      id: 7,
      title: "SK-II 神仙水 230ml",
      price: 680,
      originalPrice: 1290,
      images: [
        "https://images.unsplash.com/photo-1556229010-6c3f2c9ca5f8?w=400&h=400&fit=crop"
      ],
      categoryId: 62,
      categoryName: "护肤品",
      description: "SK-II神仙水230ml，全新未开封，日版，保质期到2026年，正品保证。",
      seller: {
        id: 1,
        username: "小明",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      location: "北京市朝阳区",
      condition: "全新",
      views: 234,
      likes: 19,
      status: "onSale",
      createTime: "2024-01-09 10:10:00",
      isLiked: false
    },
    {
      id: 8,
      title: "小米电视 55寸 4K智能电视",
      price: 1200,
      originalPrice: 1999,
      images: [
        "https://images.unsplash.com/photo-1593359677879-a4b92d0a3b89?w=400&h=400&fit=crop"
      ],
      categoryId: 32,
      categoryName: "家电",
      description: "小米55寸4K智能电视，使用一年，9成新，功能完好，无拆修，包装箱在，需自提。",
      seller: {
        id: 2,
        username: "小红",
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      location: "上海市浦东新区",
      condition: "9成新",
      views: 378,
      likes: 42,
      status: "onSale",
      createTime: "2024-01-08 13:25:00",
      isLiked: true
    },
    {
      id: 9,
      title: "编程珠玑 算法书籍 正版",
      price: 35,
      originalPrice: 89,
      images: [
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop"
      ],
      categoryId: 41,
      categoryName: "图书",
      description: "编程珠玑正版书籍，9成新，无破损无涂写，计算机算法经典书籍。",
      seller: {
        id: 1,
        username: "小明",
        avatar: "https://i.pravatar.cc/150?img=12"
      },
      location: "北京市朝阳区",
      condition: "9成新",
      views: 67,
      likes: 5,
      status: "onSale",
      createTime: "2024-01-07 08:50:00",
      isLiked: false
    },
    {
      id: 10,
      title: "Adidas 运动背包 黑色",
      price: 120,
      originalPrice: 299,
      images: [
        "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop"
      ],
      categoryId: 24,
      categoryName: "箱包",
      description: "Adidas运动背包，黑色，95新，容量大，适合运动健身使用，正品保证。",
      seller: {
        id: 2,
        username: "小红",
        avatar: "https://i.pravatar.cc/150?img=47"
      },
      location: "上海市浦东新区",
      condition: "95新",
      views: 156,
      likes: 11,
      status: "onSale",
      createTime: "2024-01-06 15:40:00",
      isLiked: false
    }
  ],
  // 订单数据
  orders: [
    {
      id: 1,
      goodsId: 5,
      goodsTitle: "AirPods Pro 第二代 主动降噪",
      goodsImage: "https://images.unsplash.com/photo-1606220945770-b5b6c2c55bf1?w=200&h=200&fit=crop",
      price: 1200,
      quantity: 1,
      totalPrice: 1200,
      status: "completed",
      createTime: "2024-01-11 11:30:00",
      payTime: "2024-01-11 11:35:00",
      completeTime: "2024-01-13 14:20:00",
      seller: {
        id: 1,
        username: "小明",
        avatar: "https://i.pravatar.cc/150?img=12"
      }
    },
    {
      id: 2,
      goodsId: 2,
      goodsTitle: "MacBook Pro 13寸 M1芯片 512GB",
      goodsImage: "https://images.unsplash.com/photo-1541807084-5c52b6b3fef6?w=200&h=200&fit=crop",
      price: 8500,
      quantity: 1,
      totalPrice: 8500,
      status: "pending",
      createTime: "2024-01-15 16:00:00",
      seller: {
        id: 2,
        username: "小红",
        avatar: "https://i.pravatar.cc/150?img=47"
      }
    }
  ],
  // 消息数据
  messages: [
    {
      id: 1,
      userId: 1,
      username: "小明",
      avatar: "https://i.pravatar.cc/150?img=12",
      lastMessage: "你好，这个商品还在吗？",
      lastTime: "2024-01-15 14:30:00",
      unreadCount: 2
    },
    {
      id: 2,
      userId: 2,
      username: "小红",
      avatar: "https://i.pravatar.cc/150?img=47",
      lastMessage: "好的，那我明天去取",
      lastTime: "2024-01-14 18:20:00",
      unreadCount: 0
    }
  ],
  // 聊天记录
  chats: {
    1: [
      { id: 1, senderId: 1, content: "你好，这个商品还在吗？", time: "2024-01-15 14:30:00" },
      { id: 2, senderId: 0, content: "还在的，需要的话可以联系我", time: "2024-01-15 14:32:00" },
      { id: 3, senderId: 1, content: "能便宜点吗？", time: "2024-01-15 14:35:00" }
    ],
    2: [
      { id: 1, senderId: 2, content: "你好，我想买这个商品", time: "2024-01-14 18:00:00" },
      { id: 2, senderId: 0, content: "好的，可以的", time: "2024-01-14 18:05:00" },
      { id: 3, senderId: 2, content: "好的，那我明天去取", time: "2024-01-14 18:20:00" }
    ]
  },
  // 地址数据
  addresses: [
    {
      id: 1,
      name: "张三",
      phone: "13800138000",
      province: "北京市",
      city: "北京市",
      district: "朝阳区",
      detail: "建国路88号SOHO现代城A座1001室",
      isDefault: true
    },
    {
      id: 2,
      name: "李四",
      phone: "13900139000",
      province: "上海市",
      city: "上海市",
      district: "浦东新区",
      detail: "陆家嘴环路1000号",
      isDefault: false
    }
  ]
};
function getGoodsList(params = {}) {
  let list = [...mockData.goods];
  if (params.categoryId) {
    list = list.filter((item) => item.categoryId === params.categoryId);
  }
  if (params.keyword) {
    const keyword = params.keyword.toLowerCase();
    list = list.filter(
      (item) => item.title.toLowerCase().includes(keyword) || item.description.toLowerCase().includes(keyword)
    );
  }
  if (params.status) {
    list = list.filter((item) => item.status === params.status);
  }
  if (params.sort === "price_asc") {
    list.sort((a, b) => a.price - b.price);
  } else if (params.sort === "price_desc") {
    list.sort((a, b) => b.price - a.price);
  } else if (params.sort === "time_desc") {
    list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
  }
  return list;
}
function getGoodsDetail(id) {
  return mockData.goods.find((item) => item.id === id) || null;
}
function getAddressList() {
  return mockData.addresses;
}
exports.getAddressList = getAddressList;
exports.getGoodsDetail = getGoodsDetail;
exports.getGoodsList = getGoodsList;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/mockData.js.map
