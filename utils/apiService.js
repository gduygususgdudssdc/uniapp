import { get, post, put, del } from './api.js'

// 用户相关 API
export const userApi = {
  // 用户注册
  register(data) {
    return post('/user/register', data)
  },
  
  // 用户登录
  login(data) {
    return post('/user/login', data)
  },
  
  // 微信快捷登录
  wechatLogin(data) {
    return post('/user/wechat/login', data)
  },
  
  // 获取用户信息
  getUserInfo(id) {
    return get(`/user/${id}`)
  },
  
  // 更新用户信息
  updateUser(id, data) {
    return put(`/user/${id}`, data)
  },
  
  // 更新用户昵称
  updateUsername(id, username) {
    return put(`/user/${id}/username`, { username })
  },
  
  // 更新用户头像
  updateAvatar(id, avatarUrl) {
    return put(`/user/${id}/avatar`, { avatarUrl })
  },
  
  // 上传头像（接收头像URL）
  uploadAvatar(id, avatarUrl) {
    return post(`/user/${id}/avatar/upload`, { avatarUrl })
  }
}

// 商品相关 API
export const goodsApi = {
  // 获取商品列表
  getGoodsList(params = {}) {
    return get('/goods/list', params)
  },
  
  // 搜索商品
  searchGoods(keyword, status = 'onSale', page = 0, size = 10) {
    return get('/goods/search', { keyword, status, page, size })
  },
  
  // 获取商品详情
  getGoodsDetail(id) {
    return get(`/goods/${id}`)
  },
  
  // 创建商品
  createGoods(data) {
    return post('/goods/create', data)
  },
  
  // 更新商品
  updateGoods(id, data) {
    return put(`/goods/${id}`, data)
  },
  
  // 删除商品
  deleteGoods(id) {
    return del(`/goods/${id}`)
  },
  
  // 获取我的商品
  getMyGoods(sellerId) {
    return get(`/goods/my/${sellerId}`)
  }
}

// 订单相关 API
export const orderApi = {
  // 创建订单
  createOrder(data) {
    return post('/order/create', data)
  },
  
  // 获取订单详情
  getOrderDetail(id) {
    return get(`/order/${id}`)
  },
  
  // 获取订单列表
  getOrderList(userId, status = '') {
    const params = status ? { status } : {}
    return get(`/order/list/${userId}`, params)
  },
  
  // 支付订单
  payOrder(id) {
    return post(`/order/pay/${id}`)
  },
  
  // 取消订单
  cancelOrder(id) {
    return post(`/order/cancel/${id}`)
  }
}

// 分类相关 API
export const categoryApi = {
  // 获取分类列表
  getCategoryList(parentId = null) {
    const params = parentId ? { parentId } : {}
    return get('/category/list', params)
  },
  
  // 获取分类详情
  getCategoryDetail(id) {
    return get(`/category/${id}`)
  }
}

// 地址相关 API
export const addressApi = {
  // 获取单个地址
  getAddress(id) {
    return get(`/address/${id}`)
  },

  // 获取地址列表
  getAddressList(userId) {
    return get(`/address/list/${userId}`)
  },
  
  // 添加地址
  addAddress(data) {
    return post('/address/add', data)
  },
  
  // 更新地址
  updateAddress(id, data) {
    return put(`/address/${id}`, data)
  },
  
  // 删除地址
  deleteAddress(id) {
    return del(`/address/${id}`)
  },
  
  // 设置默认地址
  setDefaultAddress(id) {
    return post(`/address/setDefault/${id}`)
  }
}

// Banner 相关 API
export const bannerApi = {
  // 获取 Banner 列表（只返回启用的）
  getBannerList() {
    return get('/banner/list')
  },
  
  // 获取所有 Banner（管理后台使用）
  getAllBanners() {
    return get('/banner/all')
  },
  
  // 获取单个 Banner
  getBanner(id) {
    return get(`/banner/${id}`)
  },
  
  // 创建 Banner
  createBanner(data) {
    return post('/banner/create', data)
  },
  
  // 更新 Banner
  updateBanner(id, data) {
    return put(`/banner/${id}`, data)
  },
  
  // 删除 Banner
  deleteBanner(id) {
    return del(`/banner/${id}`)
  }
}

// 收藏相关 API
export const favoriteApi = {
  // 添加收藏
  addFavorite(userId, goodsId) {
    return post('/favorite/add', { userId, goodsId })
  },
  
  // 取消收藏
  removeFavorite(userId, goodsId) {
    return post('/favorite/remove', { userId, goodsId })
  },
  
  // 检查是否已收藏
  checkFavorite(userId, goodsId) {
    return get('/favorite/check', { userId, goodsId })
  },
  
  // 获取收藏列表
  getFavoriteList(userId) {
    return get(`/favorite/list/${userId}`)
  },
  
  // 获取收藏数量
  getFavoriteCount(userId) {
    return get(`/favorite/count/${userId}`)
  }
}

// 消息相关 API
export const messageApi = {
  // 发送消息
  sendMessage(data) {
    return post('/message/send', data)
  },
  
  // 获取聊天记录
  getChatMessages(userId1, userId2) {
    return get('/message/chat', { userId1, userId2 })
  },
  
  // 获取消息列表（所有对话）
  getMessageList(userId) {
    return get(`/message/list/${userId}`)
  },
  
  // 标记消息为已读
  markAsRead(userId, senderId) {
    return post('/message/read', { userId, senderId })
  },
  
  // 获取未读消息数量
  getUnreadCount(userId) {
    return get(`/message/unread/${userId}`)
  }
}

export default {
  userApi,
  goodsApi,
  orderApi,
  categoryApi,
  addressApi,
  favoriteApi,
  bannerApi,
  messageApi
}

