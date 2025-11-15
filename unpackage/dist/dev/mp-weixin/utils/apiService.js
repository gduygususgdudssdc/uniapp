"use strict";
const utils_api = require("./api.js");
const userApi = {
  // 用户注册
  register(data) {
    return utils_api.post("/user/register", data);
  },
  // 用户登录
  login(data) {
    return utils_api.post("/user/login", data);
  },
  // 微信快捷登录
  wechatLogin(data) {
    return utils_api.post("/user/wechat/login", data);
  },
  // 获取用户信息
  getUserInfo(id) {
    return utils_api.get(`/user/${id}`);
  },
  // 更新用户信息
  updateUser(id, data) {
    return utils_api.put(`/user/${id}`, data);
  },
  // 更新用户昵称
  updateUsername(id, username) {
    return utils_api.put(`/user/${id}/username`, { username });
  },
  // 更新用户头像
  updateAvatar(id, avatarUrl) {
    return utils_api.put(`/user/${id}/avatar`, { avatarUrl });
  },
  // 上传头像（接收头像URL）
  uploadAvatar(id, avatarUrl) {
    return utils_api.post(`/user/${id}/avatar/upload`, { avatarUrl });
  }
};
const goodsApi = {
  // 获取商品列表
  getGoodsList(params = {}) {
    return utils_api.get("/goods/list", params);
  },
  // 搜索商品
  searchGoods(keyword, status = "onSale", page = 0, size = 10) {
    return utils_api.get("/goods/search", { keyword, status, page, size });
  },
  // 获取商品详情
  getGoodsDetail(id) {
    return utils_api.get(`/goods/${id}`);
  },
  // 创建商品
  createGoods(data) {
    return utils_api.post("/goods/create", data);
  },
  // 更新商品
  updateGoods(id, data) {
    return utils_api.put(`/goods/${id}`, data);
  },
  // 删除商品
  deleteGoods(id) {
    return utils_api.del(`/goods/${id}`);
  },
  // 获取我的商品
  getMyGoods(sellerId) {
    return utils_api.get(`/goods/my/${sellerId}`);
  }
};
const orderApi = {
  // 创建订单
  createOrder(data) {
    return utils_api.post("/order/create", data);
  },
  // 获取订单详情
  getOrderDetail(id) {
    return utils_api.get(`/order/${id}`);
  },
  // 获取订单列表
  getOrderList(userId, status = "") {
    const params = status ? { status } : {};
    return utils_api.get(`/order/list/${userId}`, params);
  },
  // 支付订单
  payOrder(id) {
    return utils_api.post(`/order/pay/${id}`);
  },
  // 取消订单
  cancelOrder(id) {
    return utils_api.post(`/order/cancel/${id}`);
  }
};
const categoryApi = {
  // 获取分类列表
  getCategoryList(parentId = null) {
    const params = parentId ? { parentId } : {};
    return utils_api.get("/category/list", params);
  },
  // 获取分类详情
  getCategoryDetail(id) {
    return utils_api.get(`/category/${id}`);
  }
};
const addressApi = {
  // 获取单个地址
  getAddress(id) {
    return utils_api.get(`/address/${id}`);
  },
  // 获取地址列表
  getAddressList(userId) {
    return utils_api.get(`/address/list/${userId}`);
  },
  // 添加地址
  addAddress(data) {
    return utils_api.post("/address/add", data);
  },
  // 更新地址
  updateAddress(id, data) {
    return utils_api.put(`/address/${id}`, data);
  },
  // 删除地址
  deleteAddress(id) {
    return utils_api.del(`/address/${id}`);
  },
  // 设置默认地址
  setDefaultAddress(id) {
    return utils_api.post(`/address/setDefault/${id}`);
  }
};
const bannerApi = {
  // 获取 Banner 列表（只返回启用的）
  getBannerList() {
    return utils_api.get("/banner/list");
  },
  // 获取所有 Banner（管理后台使用）
  getAllBanners() {
    return utils_api.get("/banner/all");
  },
  // 获取单个 Banner
  getBanner(id) {
    return utils_api.get(`/banner/${id}`);
  },
  // 创建 Banner
  createBanner(data) {
    return utils_api.post("/banner/create", data);
  },
  // 更新 Banner
  updateBanner(id, data) {
    return utils_api.put(`/banner/${id}`, data);
  },
  // 删除 Banner
  deleteBanner(id) {
    return utils_api.del(`/banner/${id}`);
  }
};
const favoriteApi = {
  // 添加收藏
  addFavorite(userId, goodsId) {
    return utils_api.post("/favorite/add", { userId, goodsId });
  },
  // 取消收藏
  removeFavorite(userId, goodsId) {
    return utils_api.post("/favorite/remove", { userId, goodsId });
  },
  // 检查是否已收藏
  checkFavorite(userId, goodsId) {
    return utils_api.get("/favorite/check", { userId, goodsId });
  },
  // 获取收藏列表
  getFavoriteList(userId) {
    return utils_api.get(`/favorite/list/${userId}`);
  },
  // 获取收藏数量
  getFavoriteCount(userId) {
    return utils_api.get(`/favorite/count/${userId}`);
  }
};
const messageApi = {
  // 发送消息
  sendMessage(data) {
    return utils_api.post("/message/send", data);
  },
  // 获取聊天记录
  getChatMessages(userId1, userId2) {
    return utils_api.get("/message/chat", { userId1, userId2 });
  },
  // 获取消息列表（所有对话）
  getMessageList(userId) {
    return utils_api.get(`/message/list/${userId}`);
  },
  // 标记消息为已读
  markAsRead(userId, senderId) {
    return utils_api.post("/message/read", { userId, senderId });
  },
  // 获取未读消息数量
  getUnreadCount(userId) {
    return utils_api.get(`/message/unread/${userId}`);
  }
};
exports.addressApi = addressApi;
exports.bannerApi = bannerApi;
exports.categoryApi = categoryApi;
exports.favoriteApi = favoriteApi;
exports.goodsApi = goodsApi;
exports.messageApi = messageApi;
exports.orderApi = orderApi;
exports.userApi = userApi;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/apiService.js.map
