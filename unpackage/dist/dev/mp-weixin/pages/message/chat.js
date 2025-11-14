"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockData = require("../../utils/mockData.js");
const _sfc_main = {
  data() {
    return {
      userId: "",
      currentUserId: 0,
      // 当前登录用户ID
      chatMessages: [],
      inputText: "",
      userAvatar: "https://via.placeholder.com/100",
      targetAvatar: "https://via.placeholder.com/100"
    };
  },
  onLoad(options) {
    if (options.userId) {
      this.userId = options.userId;
      this.loadChat();
    }
  },
  methods: {
    loadChat() {
      this.chatMessages = utils_mockData.getChatMessages(this.userId);
      const user = utils_mockData.getUserInfo(this.userId);
      if (user) {
        this.targetAvatar = user.avatar;
      }
    },
    sendMessage() {
      if (!this.inputText.trim())
        return;
      const newMessage = {
        id: this.chatMessages.length + 1,
        senderId: this.currentUserId,
        content: this.inputText,
        time: (/* @__PURE__ */ new Date()).toLocaleString()
      };
      this.chatMessages.push(newMessage);
      this.inputText = "";
      setTimeout(() => {
        common_vendor.index.pageScrollTo({
          scrollTop: 99999,
          duration: 300
        });
      }, 100);
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.chatMessages, (item, k0, i0) => {
      return common_vendor.e({
        a: item.senderId === $data.currentUserId
      }, item.senderId === $data.currentUserId ? {
        b: $data.userAvatar
      } : {}, {
        c: common_vendor.t(item.content),
        d: item.senderId !== $data.currentUserId
      }, item.senderId !== $data.currentUserId ? {
        e: $data.targetAvatar
      } : {}, {
        f: item.senderId !== $data.currentUserId ? 1 : "",
        g: item.id
      });
    }),
    b: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    c: $data.inputText,
    d: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    e: common_vendor.p({
      type: "paperplane",
      size: "24",
      color: "#007AFF"
    }),
    f: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-013fa921"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/message/chat.js.map
