"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      cacheSize: "12.5MB",
      notifications: true,
      autoUpdate: true
    };
  },
  methods: {
    clearCache() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除缓存吗？",
        success: (res) => {
          if (res.confirm) {
            this.cacheSize = "0MB";
            common_vendor.index.showToast({
              title: "清除成功",
              icon: "success"
            });
          }
        }
      });
    },
    onNotificationChange(e) {
      this.notifications = e.detail.value;
      common_vendor.index.showToast({
        title: e.detail.value ? "已开启" : "已关闭",
        icon: "none"
      });
    },
    onAutoUpdateChange(e) {
      this.autoUpdate = e.detail.value;
      common_vendor.index.showToast({
        title: e.detail.value ? "已开启" : "已关闭",
        icon: "none"
      });
    },
    goToAbout() {
      common_vendor.index.navigateTo({
        url: "/pages/about/index"
      });
    },
    goToHelp() {
      common_vendor.index.navigateTo({
        url: "/pages/help/index"
      });
    },
    goToFeedback() {
      common_vendor.index.navigateTo({
        url: "/pages/feedback/index"
      });
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "已退出",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/user/login"
              });
            }, 1500);
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t($data.cacheSize),
    b: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    c: common_vendor.o((...args) => $options.clearCache && $options.clearCache(...args)),
    d: $data.notifications,
    e: common_vendor.o((...args) => $options.onNotificationChange && $options.onNotificationChange(...args)),
    f: $data.autoUpdate,
    g: common_vendor.o((...args) => $options.onAutoUpdateChange && $options.onAutoUpdateChange(...args)),
    h: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    i: common_vendor.o((...args) => $options.goToAbout && $options.goToAbout(...args)),
    j: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    k: common_vendor.o((...args) => $options.goToHelp && $options.goToHelp(...args)),
    l: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    m: common_vendor.o((...args) => $options.goToFeedback && $options.goToFeedback(...args)),
    n: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a11b3e9a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/index.js.map
