import config from './config.js'

// 统一请求方法
function request(options) {
  return new Promise((resolve, reject) => {
    // 显示加载提示
    if (config.showLoading) {
      uni.showLoading({
        title: '加载中...',
        mask: true
      })
    }
    
    // 获取 token（如果有）
    const token = uni.getStorageSync('token') || ''
    
    // 发送请求
    uni.request({
      url: config.baseURL + options.url,
      method: options.method || 'GET',
      data: options.data || {},
      header: {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
        ...options.header
      },
      timeout: config.timeout,
      success: (res) => {
        // 隐藏加载提示
        if (config.showLoading) {
          uni.hideLoading()
        }
        
        // 处理响应
        if (res.statusCode === 200) {
          const response = res.data
          if (response.code === 200) {
            resolve(response.data)
          } else if (response.code === 401) {
            // token 过期或未登录，清除用户信息并跳转到登录页
            uni.removeStorageSync('userInfo')
            uni.removeStorageSync('userId')
            uni.removeStorageSync('token')
            uni.showToast({
              title: '登录已过期，请重新登录',
              icon: 'none'
            })
            setTimeout(() => {
              uni.reLaunch({
                url: '/pages/user/login'
              })
            }, 1500)
            reject(new Error('登录已过期'))
          } else {
            // 业务错误
            if (config.showError) {
              uni.showToast({
                title: response.message || '请求失败',
                icon: 'none'
              })
            }
            reject(new Error(response.message || '请求失败'))
          }
        } else {
          // HTTP 错误
          if (config.showError) {
            uni.showToast({
              title: '网络错误',
              icon: 'none'
            })
          }
          reject(new Error('网络错误'))
        }
      },
      fail: (err) => {
        // 隐藏加载提示
        if (config.showLoading) {
          uni.hideLoading()
        }
        
        // 网络错误
        if (config.showError) {
          uni.showToast({
            title: '网络连接失败',
            icon: 'none'
          })
        }
        reject(err)
      }
    })
  })
}

// GET 请求
export function get(url, params = {}) {
  // 将参数拼接到 URL
  let queryString = ''
  if (Object.keys(params).length > 0) {
    queryString = '?' + Object.keys(params)
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&')
  }
  
  return request({
    url: url + queryString,
    method: 'GET'
  })
}

// POST 请求
export function post(url, data = {}) {
  return request({
    url: url,
    method: 'POST',
    data: data
  })
}

// PUT 请求
export function put(url, data = {}) {
  return request({
    url: url,
    method: 'PUT',
    data: data
  })
}

// DELETE 请求
export function del(url) {
  return request({
    url: url,
    method: 'DELETE'
  })
}

export default {
  get,
  post,
  put,
  delete: del
}

