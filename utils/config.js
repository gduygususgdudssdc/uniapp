// API 配置

import { API_BASE_URL, API_TIMEOUT, SHOW_LOADING, SHOW_ERROR } from './api.config.js'

// 获取 API 基础地址
const getBaseURL = () => {
  // 优先使用本地存储的配置（用于临时覆盖）
  const storedURL = uni.getStorageSync('apiBaseURL')
  if (storedURL) {
    return storedURL
  }
  
  // 使用简单配置
  return API_BASE_URL
}

const config = {
  // API 基础地址（支持环境变量和动态配置）
  get baseURL() {
    return getBaseURL()
  },
  
  // 设置 API 基础地址（用于临时覆盖环境配置）
  setBaseURL(url) {
    uni.setStorageSync('apiBaseURL', url)
    console.log('API 地址已更新为:', url)
  },
  
  // 清除自定义 API 地址（恢复默认配置）
  clearBaseURL() {
    uni.removeStorageSync('apiBaseURL')
    console.log('API 地址已恢复为默认配置:', API_BASE_URL)
  },
  
  // 请求超时时间（毫秒）
  get timeout() {
    return API_TIMEOUT
  },
  
  // 是否显示加载提示
  get showLoading() {
    return SHOW_LOADING
  },
  
  // 是否显示错误提示
  get showError() {
    return SHOW_ERROR
  }
}

export default config

