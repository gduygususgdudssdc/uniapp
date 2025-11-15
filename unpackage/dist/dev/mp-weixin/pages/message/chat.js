"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const utils_websocket = require("../../utils/websocket.js");
const _sfc_main = {
  __name: "chat",
  setup(__props) {
    const userId = common_vendor.ref("");
    const currentUserId = common_vendor.ref(null);
    const chatMessages = common_vendor.ref([]);
    const inputText = common_vendor.ref("");
    const userAvatar = common_vendor.ref("");
    const targetAvatar = common_vendor.ref("");
    const targetUser = common_vendor.ref(null);
    const scrollTop = common_vendor.ref(0);
    const loading = common_vendor.ref(false);
    const inputFocus = common_vendor.ref(false);
    let isInitialLoad = true;
    async function loadChat() {
      if (!currentUserId.value || !userId.value)
        return;
      try {
        if (isInitialLoad) {
          loading.value = true;
        }
        const messages = await utils_apiService.messageApi.getChatMessages(currentUserId.value, parseInt(userId.value));
        chatMessages.value = messages || [];
        await utils_apiService.messageApi.markAsRead(currentUserId.value, parseInt(userId.value));
        await common_vendor.nextTick$1();
        scrollToBottom();
        if (isInitialLoad) {
          isInitialLoad = false;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:85", "加载聊天记录失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    async function loadUserInfo() {
      try {
        const currentUser = utils_auth.getCurrentUser();
        if (currentUser) {
          userAvatar.value = currentUser.avatar || "/static/default-avatar.png";
        }
        const targetId = parseInt(userId.value);
        const user = await utils_apiService.userApi.getUserInfo(targetId);
        if (user) {
          targetUser.value = user;
          targetAvatar.value = user.avatar || "/static/default-avatar.png";
          common_vendor.index.setNavigationBarTitle({
            title: user.username || "聊天"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:113", "加载用户信息失败:", error);
      }
    }
    function handleWebSocketMessage(data) {
      common_vendor.index.__f__("log", "at pages/message/chat.vue:119", "=== 前端收到 WebSocket 消息 ===");
      common_vendor.index.__f__("log", "at pages/message/chat.vue:120", "消息内容:", JSON.stringify(data, null, 2));
      common_vendor.index.__f__("log", "at pages/message/chat.vue:121", "消息类型:", data.type);
      common_vendor.index.__f__("log", "at pages/message/chat.vue:122", "当前用户ID:", currentUserId.value);
      common_vendor.index.__f__("log", "at pages/message/chat.vue:123", "对方用户ID:", userId.value);
      if (data.type === "MESSAGE") {
        const message = {
          id: data.id,
          senderId: data.senderId,
          receiverId: data.receiverId,
          content: data.content,
          createTime: data.createTime,
          isRead: data.isRead
        };
        common_vendor.index.__f__("log", "at pages/message/chat.vue:136", "解析后的消息:", message);
        common_vendor.index.__f__("log", "at pages/message/chat.vue:137", "当前消息列表长度:", chatMessages.value.length);
        const exists = chatMessages.value.some((m) => m.id === message.id);
        common_vendor.index.__f__("log", "at pages/message/chat.vue:141", "消息是否已存在:", exists);
        if (!exists) {
          common_vendor.index.__f__("log", "at pages/message/chat.vue:144", "✓ 添加新消息到列表");
          chatMessages.value.push(message);
          common_vendor.index.__f__("log", "at pages/message/chat.vue:146", "添加后消息列表长度:", chatMessages.value.length);
          if (message.senderId !== currentUserId.value) {
            common_vendor.index.__f__("log", "at pages/message/chat.vue:150", "标记消息为已读");
            utils_websocket.wsManager.send("READ", {
              senderId: message.senderId,
              receiverId: currentUserId.value
            });
          }
          common_vendor.nextTick$1(() => {
            common_vendor.index.__f__("log", "at pages/message/chat.vue:159", "滚动到底部");
            scrollToBottom();
          });
        } else {
          common_vendor.index.__f__("log", "at pages/message/chat.vue:163", "⚠ 消息已存在，跳过");
        }
      } else if (data.type === "ERROR") {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:166", "收到错误消息:", data.content);
        common_vendor.index.showToast({ title: data.content || "操作失败", icon: "none" });
      } else {
        common_vendor.index.__f__("warn", "at pages/message/chat.vue:169", "未知消息类型:", data.type);
      }
    }
    function sendMessage() {
      if (!inputText.value.trim())
        return;
      if (!utils_auth.checkLogin())
        return;
      if (!currentUserId.value || !userId.value) {
        common_vendor.index.showToast({ title: "用户信息错误", icon: "none" });
        return;
      }
      const content = inputText.value.trim();
      inputText.value = "";
      const tempMessage = {
        id: Date.now(),
        // 临时ID
        senderId: currentUserId.value,
        receiverId: parseInt(userId.value),
        content,
        createTime: (/* @__PURE__ */ new Date()).toISOString(),
        isRead: false
      };
      chatMessages.value.push(tempMessage);
      common_vendor.nextTick$1(() => {
        scrollToBottom();
      });
      const success = utils_websocket.wsManager.send("SEND", {
        senderId: currentUserId.value,
        receiverId: parseInt(userId.value),
        content
      });
      if (!success) {
        sendMessageByHttp(tempMessage, content);
      }
    }
    async function sendMessageByHttp(tempMessage, content) {
      try {
        const messageData = {
          senderId: currentUserId.value,
          receiverId: parseInt(userId.value),
          content
        };
        const savedMessage = await utils_apiService.messageApi.sendMessage(messageData);
        const index = chatMessages.value.findIndex((m) => m.id === tempMessage.id);
        if (index !== -1) {
          chatMessages.value[index] = savedMessage;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:232", "发送消息失败:", error);
        common_vendor.index.showToast({ title: "发送失败", icon: "none" });
        chatMessages.value = chatMessages.value.filter((m) => m.id !== tempMessage.id);
      }
    }
    function scrollToBottom() {
      common_vendor.nextTick$1(() => {
        scrollTop.value = 99999;
      });
    }
    function loadMoreMessages() {
    }
    function connectWebSocket() {
      if (!currentUserId.value) {
        common_vendor.index.__f__("error", "at pages/message/chat.vue:254", "无法连接 WebSocket: 用户ID为空");
        return;
      }
      common_vendor.index.__f__("log", "at pages/message/chat.vue:258", "开始连接 WebSocket, 用户ID:", currentUserId.value);
      utils_websocket.wsManager.connect(
        currentUserId.value.toString(),
        handleWebSocketMessage,
        (error) => {
          common_vendor.index.__f__("error", "at pages/message/chat.vue:264", "WebSocket 连接错误:", error);
          common_vendor.index.showToast({
            title: "WebSocket 连接失败，请检查网络",
            icon: "none",
            duration: 2e3
          });
        }
      );
    }
    function disconnectWebSocket() {
      utils_websocket.wsManager.disconnect();
    }
    function formatTime(time) {
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (minutes < 1)
        return "刚刚";
      if (minutes < 60)
        return `${minutes}分钟前`;
      if (hours < 24)
        return `${hours}小时前`;
      if (days === 1)
        return "昨天";
      if (days < 7)
        return `${days}天前`;
      return `${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${String(date.getMinutes()).padStart(2, "0")}`;
    }
    common_vendor.onLoad((options) => {
      if (options.userId) {
        userId.value = options.userId;
        currentUserId.value = utils_auth.getCurrentUserId();
        if (!currentUserId.value) {
          utils_auth.checkLogin();
          return;
        }
        loadUserInfo();
        loadChat();
        connectWebSocket();
      } else {
        common_vendor.index.showToast({ title: "参数错误", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    common_vendor.onShow(() => {
      if (currentUserId.value && userId.value) {
        isInitialLoad = false;
        loadChat();
        if (!utils_websocket.wsManager.isConnected) {
          connectWebSocket();
        }
      }
    });
    common_vendor.onHide(() => {
    });
    common_vendor.onUnmounted(() => {
      disconnectWebSocket();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(chatMessages.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.senderId === currentUserId.value
          }, item.senderId === currentUserId.value ? {
            b: userAvatar.value
          } : {}, {
            c: common_vendor.t(item.content),
            d: common_vendor.t(formatTime(item.createTime)),
            e: item.senderId !== currentUserId.value
          }, item.senderId !== currentUserId.value ? {
            f: targetAvatar.value
          } : {}, {
            g: item.senderId === currentUserId.value ? 1 : "",
            h: item.id
          });
        }),
        b: loading.value
      }, loading.value ? {} : {}, {
        c: scrollTop.value,
        d: common_vendor.o(loadMoreMessages),
        e: common_vendor.o(sendMessage),
        f: inputFocus.value,
        g: inputText.value,
        h: common_vendor.o(($event) => inputText.value = $event.detail.value),
        i: common_vendor.o(sendMessage)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-013fa921"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/chat.js.map
