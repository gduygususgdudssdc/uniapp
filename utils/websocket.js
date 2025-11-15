// WebSocket 工具类（简化版，不使用 STOMP）
import { API_BASE_URL } from './api.config.js'

class WebSocketManager {
  constructor() {
    this.socket = null
    this.reconnectTimer = null
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectInterval = 3000
    this.isConnected = false
    this.onMessageCallback = null
    this.onErrorCallback = null
    this.userId = null
  }

  /**
   * 连接 WebSocket
   * @param {string} userId - 用户ID
   * @param {function} onMessage - 消息回调
   * @param {function} onError - 错误回调
   */
  connect(userId, onMessage, onError) {
    this.userId = userId
    this.onMessageCallback = onMessage
    this.onErrorCallback = onError

    // 如果已有连接且正在连接中，不重复连接
    if (this.socket) {
      if (this.socket instanceof WebSocket) {
        // 原生 WebSocket
        if (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN) {
          console.log('WebSocket 正在连接或已连接，跳过重复连接')
          return
        }
      } else {
        // uni-app WebSocket
        if (this.isConnected) {
          console.log('WebSocket 已连接')
          return
        }
      }
    }

    // 清理旧连接
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    try {
      // 构建 WebSocket URL
      // 将 http:// 或 https:// 替换为 ws:// 或 wss://
      let baseUrl = API_BASE_URL.trim().replace(/^http/, 'ws')
      
      // 注意：由于 servlet context-path 是 /api，WebSocket 路径也需要包含 /api
      // 测试结果显示只有 /api/ws/chat 能连接成功
      // 保持 /api 前缀，添加 WebSocket 路径和用户ID参数
      let wsUrl = `${baseUrl}/ws/chat?userId=${userId}`
      
      console.log('=== WebSocket 连接信息 ===')
      console.log('原始 API URL:', API_BASE_URL)
      console.log('转换后基础 URL:', baseUrl)
      console.log('完整 WebSocket URL:', wsUrl)
      console.log('用户ID:', userId)

      // 在 H5 环境下，优先使用原生 WebSocket（更稳定）
      // 注意：某些浏览器可能不支持原生 WebSocket，需要降级到 uni-app API
      if (typeof WebSocket !== 'undefined' && typeof window !== 'undefined') {
        try {
          console.log('检测到 WebSocket API，使用原生 WebSocket')
          this.socket = new WebSocket(wsUrl)
          this.setupNativeWebSocket()
          return
        } catch (nativeError) {
          console.warn('原生 WebSocket 创建失败，使用 uni-app API:', nativeError)
        }
      }

      // 使用 uni-app 的 WebSocket API（小程序环境）
      this.socket = uni.connectSocket({
        url: wsUrl,
        header: {
          'userId': userId.toString()
        },
        success: () => {
          console.log('✓ WebSocket 连接请求已发送')
        },
        fail: (err) => {
          console.error('✗ WebSocket 连接请求失败:', err)
          console.error('失败详情:', JSON.stringify(err, null, 2))
          if (onError) onError(err)
          this.scheduleReconnect()
        }
      })

      // 监听连接打开
      this.socket.onOpen(() => {
        console.log('✓ WebSocket 连接成功打开')
        this.isConnected = true
        this.reconnectAttempts = 0
      })

      // 监听消息
      this.socket.onMessage((res) => {
        console.log('收到 WebSocket 消息:', res.data)
        try {
          const data = JSON.parse(res.data)
          if (this.onMessageCallback) {
            this.onMessageCallback(data)
          }
        } catch (e) {
          console.error('解析消息失败:', e, res.data)
        }
      })

      // 监听错误
      this.socket.onError((err) => {
        console.error('✗ WebSocket 错误:', err)
        console.error('错误类型:', typeof err)
        console.error('错误详情:', JSON.stringify(err, null, 2))
        console.error('错误消息:', err?.message || err?.errMsg || '未知错误')
        console.error('错误代码:', err?.errCode || 'N/A')
        this.isConnected = false
        if (this.onErrorCallback) {
          this.onErrorCallback(err)
        }
      })

      // 监听关闭
      this.socket.onClose((res) => {
        console.log('WebSocket 已关闭')
        console.log('关闭原因:', res?.code, res?.reason || '未知')
        this.isConnected = false
        this.scheduleReconnect()
      })

    } catch (error) {
      console.error('创建 WebSocket 连接失败:', error)
      if (onError) onError(error)
    }
  }

  /**
   * 发送消息
   */
  send(type, data) {
    if (!this.socket || !this.isConnected) {
      console.error('WebSocket 未连接')
      return false
    }

    try {
      const message = {
        type: type,
        ...data
      }
      const messageStr = JSON.stringify(message)
      
      // 原生 WebSocket
      if (this.socket instanceof WebSocket) {
        this.socket.send(messageStr)
        console.log('✓ 原生 WebSocket 消息已发送:', type)
        return true
      }
      
      // uni-app WebSocket
      this.socket.send({
        data: messageStr,
        success: () => {
          console.log('✓ uni-app WebSocket 消息已发送:', type)
        },
        fail: (err) => {
          console.error('✗ 发送消息失败:', err)
        }
      })
      return true
    } catch (error) {
      console.error('发送消息错误:', error)
      return false
    }
  }

  /**
   * 断开连接
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
      this.reconnectTimer = null
    }

    if (this.socket) {
      // 原生 WebSocket
      if (this.socket instanceof WebSocket) {
        this.socket.close()
        console.log('原生 WebSocket 已断开')
      } else {
        // uni-app WebSocket
        this.socket.close({
          success: () => {
            console.log('uni-app WebSocket 已断开')
          }
        })
      }
      this.socket = null
    }
    this.isConnected = false
    this.reconnectAttempts = 0
    this.onMessageCallback = null
    this.onErrorCallback = null
  }

  /**
   * 设置原生 WebSocket 事件监听（H5 环境）
   */
  setupNativeWebSocket() {
    if (!this.socket) return
    
    this.socket.onopen = () => {
      console.log('✓ 原生 WebSocket 连接成功打开')
      console.log('WebSocket 状态:', this.socket.readyState)
      this.isConnected = true
      this.reconnectAttempts = 0
      // 清除重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer)
        this.reconnectTimer = null
      }
    }
    
    this.socket.onmessage = (event) => {
      console.log('收到原生 WebSocket 消息:', event.data)
      try {
        const data = JSON.parse(event.data)
        if (this.onMessageCallback) {
          this.onMessageCallback(data)
        }
      } catch (e) {
        console.error('解析消息失败:', e, event.data)
      }
    }
    
    this.socket.onerror = (error) => {
      console.error('✗ 原生 WebSocket 错误:', error)
      console.error('WebSocket 状态:', this.socket?.readyState)
      this.isConnected = false
      if (this.onErrorCallback) {
        this.onErrorCallback(error)
      }
    }
    
    this.socket.onclose = (event) => {
      console.log('原生 WebSocket 已关闭')
      console.log('关闭代码:', event.code)
      console.log('关闭原因:', event.reason || '无')
      console.log('WebSocket 状态:', this.socket?.readyState)
      this.isConnected = false
      
      // 只有非正常关闭（非 1000）或非主动断开时才重连
      // 1000 是正常关闭，可能是后端主动关闭或页面切换导致
      if (event.code !== 1000 && event.code !== 1001) {
        console.log('非正常关闭，将尝试重连')
        this.scheduleReconnect()
      } else {
        console.log('正常关闭，不重连')
        // 如果是正常关闭，清除重连定时器
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer)
          this.reconnectTimer = null
        }
      }
    }
  }

  /**
   * 安排重连
   */
  scheduleReconnect() {
    if (!this.userId) {
      console.log('用户ID为空，不重连')
      return
    }
    
    // 如果已经连接，不重连
    if (this.isConnected) {
      console.log('WebSocket 已连接，不重连')
      return
    }
    
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      console.error('达到最大重连次数，停止重连')
      return
    }

    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer)
    }

    this.reconnectAttempts++
    console.log(`将在 ${this.reconnectInterval}ms 后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`)

    this.reconnectTimer = setTimeout(() => {
      console.log('尝试重连 WebSocket...')
      // 重置 socket，确保重新创建连接
      this.socket = null
      this.connect(this.userId, this.onMessageCallback, this.onErrorCallback)
    }, this.reconnectInterval)
  }
}

// 创建单例
const wsManager = new WebSocketManager()

export default wsManager
