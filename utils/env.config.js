// 环境变量配置文件
// 可以通过修改此文件来设置不同环境的 API 地址

// 开发环境配置
const development = {
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  showLoading: true,
  showError: true
}

// 真机调试环境配置（局域网 IP）
const device = {
  baseURL: 'http://10.1.23.38:8080/api', // 你的电脑局域网 IP
  timeout: 10000,
  showLoading: true,
  showError: true
}

// 公网访问配置（使用 cpolar 内网穿透）
const publicConfig = {
  baseURL: 'https://56b33ccb.r5.cpolar.top/api', // cpolar 公网地址
  timeout: 15000, // 公网访问可能需要更长时间
  showLoading: true,
  showError: true
}

// 生产环境配置
const production = {
  baseURL: 'https://your-domain.com/api', // 替换为实际的生产服务器地址
  timeout: 10000,
  showLoading: true,
  showError: true
}

// 根据环境变量或手动设置选择配置
// 可以通过以下方式设置环境：
// 1. 在 HBuilderX 中设置：运行 -> 运行到小程序模拟器 -> 运行配置 -> 环境变量
// 2. 在代码中手动设置：window.ENV = 'device'
// 3. 使用 uni-app 的条件编译

let currentEnv = 'public' // 默认使用开发环境

// 尝试从环境变量获取
// #ifdef H5
if (import.meta.env?.MODE) {
  currentEnv = import.meta.env.MODE
} else if (import.meta.env?.VITE_APP_ENV) {
  currentEnv = import.meta.env.VITE_APP_ENV
}
// #endif

// 尝试从全局变量获取（用于手动设置）
if (typeof window !== 'undefined' && window.ENV) {
  currentEnv = window.ENV
}

// 尝试从本地存储获取（用于持久化环境配置）
try {
  const storedEnv = uni.getStorageSync('appEnv')
  if (storedEnv) {
    currentEnv = storedEnv
  }
} catch (e) {
  // 忽略错误
}

// 根据环境选择配置
let envConfig = development // 默认配置

switch (currentEnv) {
  case 'device':
  case 'mobile':
    envConfig = device
    break
  case 'public':      // 新增：公网访问
  case 'internet':    // 新增：公网访问
  case 'cpolar':     // 新增：cpolar 专用
    envConfig = publicConfig
    break
  case 'production':
  case 'prod':
    envConfig = production
    break
  case 'development':
  case 'dev':
  default:
    envConfig = development
    break
}

// 导出环境配置
export default {
  ...envConfig,
  // 当前环境
  env: currentEnv,
  // 是否为开发环境
  isDev: currentEnv === 'development' || currentEnv === 'dev',
  // 是否为生产环境
  isProd: currentEnv === 'production' || currentEnv === 'prod',
  // 是否为真机调试
  isDevice: currentEnv === 'device' || currentEnv === 'mobile',
  // 是否为公网访问
  isPublic: currentEnv === 'public' || currentEnv === 'internet' || currentEnv === 'cpolar'
}

