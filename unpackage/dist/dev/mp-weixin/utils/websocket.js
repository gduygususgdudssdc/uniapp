"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_config = require("./api.config.js");
class WebSocketManager {
  constructor() {
    this.socket = null;
    this.reconnectTimer = null;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectInterval = 3e3;
    this.isConnected = false;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
    this.userId = null;
  }
  /**
   * 连接 WebSocket
   * @param {string} userId - 用户ID
   * @param {function} onMessage - 消息回调
   * @param {function} onError - 错误回调
   */
  connect(userId, onMessage, onError) {
    this.userId = userId;
    this.onMessageCallback = onMessage;
    this.onErrorCallback = onError;
    if (this.socket) {
      if (this.socket instanceof WebSocket) {
        if (this.socket.readyState === WebSocket.CONNECTING || this.socket.readyState === WebSocket.OPEN) {
          common_vendor.index.__f__("log", "at utils/websocket.js:33", "WebSocket 正在连接或已连接，跳过重复连接");
          return;
        }
      } else {
        if (this.isConnected) {
          common_vendor.index.__f__("log", "at utils/websocket.js:39", "WebSocket 已连接");
          return;
        }
      }
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    try {
      let baseUrl = utils_api_config.API_BASE_URL.trim().replace(/^http/, "ws");
      let wsUrl = `${baseUrl}/ws/chat?userId=${userId}`;
      common_vendor.index.__f__("log", "at utils/websocket.js:61", "=== WebSocket 连接信息 ===");
      common_vendor.index.__f__("log", "at utils/websocket.js:62", "原始 API URL:", utils_api_config.API_BASE_URL);
      common_vendor.index.__f__("log", "at utils/websocket.js:63", "转换后基础 URL:", baseUrl);
      common_vendor.index.__f__("log", "at utils/websocket.js:64", "完整 WebSocket URL:", wsUrl);
      common_vendor.index.__f__("log", "at utils/websocket.js:65", "用户ID:", userId);
      if (typeof WebSocket !== "undefined" && typeof window !== "undefined") {
        try {
          common_vendor.index.__f__("log", "at utils/websocket.js:71", "检测到 WebSocket API，使用原生 WebSocket");
          this.socket = new WebSocket(wsUrl);
          this.setupNativeWebSocket();
          return;
        } catch (nativeError) {
          common_vendor.index.__f__("warn", "at utils/websocket.js:76", "原生 WebSocket 创建失败，使用 uni-app API:", nativeError);
        }
      }
      this.socket = common_vendor.index.connectSocket({
        url: wsUrl,
        header: {
          "userId": userId.toString()
        },
        success: () => {
          common_vendor.index.__f__("log", "at utils/websocket.js:87", "✓ WebSocket 连接请求已发送");
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at utils/websocket.js:90", "✗ WebSocket 连接请求失败:", err);
          common_vendor.index.__f__("error", "at utils/websocket.js:91", "失败详情:", JSON.stringify(err, null, 2));
          if (onError)
            onError(err);
          this.scheduleReconnect();
        }
      });
      this.socket.onOpen(() => {
        common_vendor.index.__f__("log", "at utils/websocket.js:99", "✓ WebSocket 连接成功打开");
        this.isConnected = true;
        this.reconnectAttempts = 0;
      });
      this.socket.onMessage((res) => {
        common_vendor.index.__f__("log", "at utils/websocket.js:106", "收到 WebSocket 消息:", res.data);
        try {
          const data = JSON.parse(res.data);
          if (this.onMessageCallback) {
            this.onMessageCallback(data);
          }
        } catch (e) {
          common_vendor.index.__f__("error", "at utils/websocket.js:113", "解析消息失败:", e, res.data);
        }
      });
      this.socket.onError((err) => {
        common_vendor.index.__f__("error", "at utils/websocket.js:119", "✗ WebSocket 错误:", err);
        common_vendor.index.__f__("error", "at utils/websocket.js:120", "错误类型:", typeof err);
        common_vendor.index.__f__("error", "at utils/websocket.js:121", "错误详情:", JSON.stringify(err, null, 2));
        common_vendor.index.__f__("error", "at utils/websocket.js:122", "错误消息:", (err == null ? void 0 : err.message) || (err == null ? void 0 : err.errMsg) || "未知错误");
        common_vendor.index.__f__("error", "at utils/websocket.js:123", "错误代码:", (err == null ? void 0 : err.errCode) || "N/A");
        this.isConnected = false;
        if (this.onErrorCallback) {
          this.onErrorCallback(err);
        }
      });
      this.socket.onClose((res) => {
        common_vendor.index.__f__("log", "at utils/websocket.js:132", "WebSocket 已关闭");
        common_vendor.index.__f__("log", "at utils/websocket.js:133", "关闭原因:", res == null ? void 0 : res.code, (res == null ? void 0 : res.reason) || "未知");
        this.isConnected = false;
        this.scheduleReconnect();
      });
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/websocket.js:139", "创建 WebSocket 连接失败:", error);
      if (onError)
        onError(error);
    }
  }
  /**
   * 发送消息
   */
  send(type, data) {
    if (!this.socket || !this.isConnected) {
      common_vendor.index.__f__("error", "at utils/websocket.js:149", "WebSocket 未连接");
      return false;
    }
    try {
      const message = {
        type,
        ...data
      };
      const messageStr = JSON.stringify(message);
      if (this.socket instanceof WebSocket) {
        this.socket.send(messageStr);
        common_vendor.index.__f__("log", "at utils/websocket.js:163", "✓ 原生 WebSocket 消息已发送:", type);
        return true;
      }
      this.socket.send({
        data: messageStr,
        success: () => {
          common_vendor.index.__f__("log", "at utils/websocket.js:171", "✓ uni-app WebSocket 消息已发送:", type);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at utils/websocket.js:174", "✗ 发送消息失败:", err);
        }
      });
      return true;
    } catch (error) {
      common_vendor.index.__f__("error", "at utils/websocket.js:179", "发送消息错误:", error);
      return false;
    }
  }
  /**
   * 断开连接
   */
  disconnect() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.socket) {
      if (this.socket instanceof WebSocket) {
        this.socket.close();
        common_vendor.index.__f__("log", "at utils/websocket.js:197", "原生 WebSocket 已断开");
      } else {
        this.socket.close({
          success: () => {
            common_vendor.index.__f__("log", "at utils/websocket.js:202", "uni-app WebSocket 已断开");
          }
        });
      }
      this.socket = null;
    }
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.onMessageCallback = null;
    this.onErrorCallback = null;
  }
  /**
   * 设置原生 WebSocket 事件监听（H5 环境）
   */
  setupNativeWebSocket() {
    if (!this.socket)
      return;
    this.socket.onopen = () => {
      common_vendor.index.__f__("log", "at utils/websocket.js:221", "✓ 原生 WebSocket 连接成功打开");
      common_vendor.index.__f__("log", "at utils/websocket.js:222", "WebSocket 状态:", this.socket.readyState);
      this.isConnected = true;
      this.reconnectAttempts = 0;
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }
    };
    this.socket.onmessage = (event) => {
      common_vendor.index.__f__("log", "at utils/websocket.js:233", "收到原生 WebSocket 消息:", event.data);
      try {
        const data = JSON.parse(event.data);
        if (this.onMessageCallback) {
          this.onMessageCallback(data);
        }
      } catch (e) {
        common_vendor.index.__f__("error", "at utils/websocket.js:240", "解析消息失败:", e, event.data);
      }
    };
    this.socket.onerror = (error) => {
      var _a;
      common_vendor.index.__f__("error", "at utils/websocket.js:245", "✗ 原生 WebSocket 错误:", error);
      common_vendor.index.__f__("error", "at utils/websocket.js:246", "WebSocket 状态:", (_a = this.socket) == null ? void 0 : _a.readyState);
      this.isConnected = false;
      if (this.onErrorCallback) {
        this.onErrorCallback(error);
      }
    };
    this.socket.onclose = (event) => {
      var _a;
      common_vendor.index.__f__("log", "at utils/websocket.js:254", "原生 WebSocket 已关闭");
      common_vendor.index.__f__("log", "at utils/websocket.js:255", "关闭代码:", event.code);
      common_vendor.index.__f__("log", "at utils/websocket.js:256", "关闭原因:", event.reason || "无");
      common_vendor.index.__f__("log", "at utils/websocket.js:257", "WebSocket 状态:", (_a = this.socket) == null ? void 0 : _a.readyState);
      this.isConnected = false;
      if (event.code !== 1e3 && event.code !== 1001) {
        common_vendor.index.__f__("log", "at utils/websocket.js:263", "非正常关闭，将尝试重连");
        this.scheduleReconnect();
      } else {
        common_vendor.index.__f__("log", "at utils/websocket.js:266", "正常关闭，不重连");
        if (this.reconnectTimer) {
          clearTimeout(this.reconnectTimer);
          this.reconnectTimer = null;
        }
      }
    };
  }
  /**
   * 安排重连
   */
  scheduleReconnect() {
    if (!this.userId) {
      common_vendor.index.__f__("log", "at utils/websocket.js:281", "用户ID为空，不重连");
      return;
    }
    if (this.isConnected) {
      common_vendor.index.__f__("log", "at utils/websocket.js:287", "WebSocket 已连接，不重连");
      return;
    }
    if (this.reconnectAttempts >= this.maxReconnectAttempts) {
      common_vendor.index.__f__("error", "at utils/websocket.js:292", "达到最大重连次数，停止重连");
      return;
    }
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
    }
    this.reconnectAttempts++;
    common_vendor.index.__f__("log", "at utils/websocket.js:301", `将在 ${this.reconnectInterval}ms 后尝试重连 (${this.reconnectAttempts}/${this.maxReconnectAttempts})`);
    this.reconnectTimer = setTimeout(() => {
      common_vendor.index.__f__("log", "at utils/websocket.js:304", "尝试重连 WebSocket...");
      this.socket = null;
      this.connect(this.userId, this.onMessageCallback, this.onErrorCallback);
    }, this.reconnectInterval);
  }
}
const wsManager = new WebSocketManager();
exports.wsManager = wsManager;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/websocket.js.map
