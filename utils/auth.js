// 用户认证相关工具函数

/**
 * 检查是否已登录
 */
export function isLoggedIn() {
  const token = uni.getStorageSync('token')
  const userInfo = uni.getStorageSync('userInfo')
  return !!(token && userInfo)
}

/**
 * 获取当前用户信息
 */
export function getCurrentUser() {
  return uni.getStorageSync('userInfo') || null
}

/**
 * 获取当前用户ID
 */
export function getCurrentUserId() {
  const userInfo = getCurrentUser()
  return userInfo ? userInfo.id : null
}

/**
 * 获取 token
 */
export function getToken() {
  return uni.getStorageSync('token') || ''
}

/**
 * 保存用户信息和 token
 */
export function saveUserInfo(userInfo, token) {
  if (userInfo) {
    uni.setStorageSync('userInfo', userInfo)
    if (userInfo.id) {
      uni.setStorageSync('userId', userInfo.id)
    }
  }
  if (token) {
    uni.setStorageSync('token', token)
  }
}

/**
 * 清除用户信息（退出登录）
 */
export function clearUserInfo() {
  uni.removeStorageSync('userInfo')
  uni.removeStorageSync('userId')
  uni.removeStorageSync('token')
}

/**
 * 检查登录状态，未登录则跳转到登录页
 */
export function checkLogin() {
  if (!isLoggedIn()) {
    uni.showToast({
      title: '请先登录',
      icon: 'none'
    })
    setTimeout(() => {
      uni.navigateTo({
        url: '/pages/user/login'
      })
    }, 1500)
    return false
  }
  return true
}

/**
 * 退出登录
 */
export function logout() {
  return new Promise((resolve) => {
    uni.showModal({
      title: '提示',
      content: '确定要退出登录吗？',
      success: (res) => {
        if (res.confirm) {
          // 清除用户信息
          clearUserInfo()
          
          uni.showToast({
            title: '已退出登录',
            icon: 'success'
          })
          
          // 跳转到登录页
          setTimeout(() => {
            uni.reLaunch({
              url: '/pages/user/login'
            })
            resolve()
          }, 1500)
        } else {
          resolve()
        }
      }
    })
  })
}

export default {
  isLoggedIn,
  getCurrentUser,
  getCurrentUserId,
  getToken,
  saveUserInfo,
  clearUserInfo,
  checkLogin,
  logout
}








