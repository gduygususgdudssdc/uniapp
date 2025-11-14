"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      messageList: []
    };
  },
  onLoad() {
    this.loadMessages();
  },
  onShow() {
    this.loadMessages();
  },
  methods: {
    loadMessages() {
      this.messageList = getMessageList();
    },
    goToChat(userId) {
      common_vendor.index.navigateTo({
        url: `/pages/message/chat?userId=${userId}`
      });
    },
    formatTime(time) {
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const days = Math.floor(diff / (1e3 * 60 * 60 * 24));
      if (days === 0) {
        const hours = Math.floor(diff / (1e3 * 60 * 60));
        if (hours === 0) {
          const minutes = Math.floor(diff / (1e3 * 60));
          return minutes + "分钟前";
        }
        return hours + "小时前";
      }
      if (days === 1)
        return "昨天";
      if (days < 7)
        return days + "天前";
      return date.toLocaleDateString();
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.messageList, (item, k0, i0) => {
      return common_vendor.e({
        a: item.avatar,
        b: common_vendor.t(item.username),
        c: common_vendor.t($options.formatTime(item.lastTime)),
        d: common_vendor.t(item.lastMessage),
        e: item.unreadCount > 0
      }, item.unreadCount > 0 ? {
        f: common_vendor.t(item.unreadCount)
      } : {}, {
        g: item.id,
        h: common_vendor.o(($event) => $options.goToChat(item.userId), item.id)
      });
    }),
    b: $data.messageList.length === 0
  }, $data.messageList.length === 0 ? {
    c: common_vendor.p({
      type: "chatboxes",
      size: "80",
      color: "#ddd"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-904eb306"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/list.js.map
