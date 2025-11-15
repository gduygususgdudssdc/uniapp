"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const messageList = common_vendor.ref([]);
    const loading = common_vendor.ref(false);
    const currentUserId = common_vendor.ref(null);
    let pollTimer = null;
    async function loadMessages() {
      if (!currentUserId.value) {
        currentUserId.value = utils_auth.getCurrentUserId();
        if (!currentUserId.value) {
          return;
        }
      }
      try {
        loading.value = true;
        const list = await utils_apiService.messageApi.getMessageList(currentUserId.value);
        messageList.value = list || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/message/list.vue:59", "加载消息列表失败:", error);
        common_vendor.index.showToast({ title: "加载失败", icon: "none" });
      } finally {
        loading.value = false;
      }
    }
    function goToChat(userId) {
      if (!utils_auth.checkLogin())
        return;
      common_vendor.index.navigateTo({
        url: `/pages/message/chat?userId=${userId}`
      });
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
      return `${date.getMonth() + 1}-${date.getDate()}`;
    }
    function startPolling() {
      pollTimer = setInterval(() => {
        if (currentUserId.value) {
          loadMessages();
        }
      }, 5e3);
    }
    function stopPolling() {
      if (pollTimer) {
        clearInterval(pollTimer);
        pollTimer = null;
      }
    }
    common_vendor.onLoad(() => {
      currentUserId.value = utils_auth.getCurrentUserId();
      if (currentUserId.value) {
        loadMessages();
        startPolling();
      }
    });
    common_vendor.onShow(() => {
      if (currentUserId.value) {
        loadMessages();
        startPolling();
      }
    });
    common_vendor.onUnmounted(() => {
      stopPolling();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(messageList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.avatar || "/static/default-avatar.png",
            b: common_vendor.t(item.username),
            c: common_vendor.t(formatTime(item.lastTime)),
            d: common_vendor.t(item.lastMessage || "暂无消息"),
            e: item.unreadCount > 0
          }, item.unreadCount > 0 ? {
            f: common_vendor.t(item.unreadCount > 99 ? "99+" : item.unreadCount)
          } : {}, {
            g: item.userId,
            h: common_vendor.o(($event) => goToChat(item.userId), item.userId)
          });
        }),
        b: messageList.value.length === 0 && !loading.value
      }, messageList.value.length === 0 && !loading.value ? {} : {}, {
        c: loading.value
      }, loading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-904eb306"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/list.js.map
