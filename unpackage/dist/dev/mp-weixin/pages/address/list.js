"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockData = require("../../utils/mockData.js");
const _sfc_main = {
  data() {
    return {
      addressList: []
    };
  },
  onLoad() {
    this.loadAddresses();
  },
  methods: {
    loadAddresses() {
      this.addressList = utils_mockData.getAddressList();
    },
    selectAddress(item) {
      const pages = getCurrentPages();
      const prevPage = pages[pages.length - 2];
      if (prevPage && prevPage.route === "pages/order/detail") {
        common_vendor.index.navigateBack();
        return;
      }
    },
    addAddress() {
      common_vendor.index.navigateTo({
        url: "/pages/address/edit"
      });
    },
    editAddress(id) {
      common_vendor.index.navigateTo({
        url: `/pages/address/edit?id=${id}`
      });
    },
    deleteAddress(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除此地址吗？",
        success: (res) => {
          if (res.confirm) {
            this.addressList = this.addressList.filter((item) => item.id !== id);
            common_vendor.index.showToast({
              title: "删除成功",
              icon: "success"
            });
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
  return common_vendor.e({
    a: common_vendor.f($data.addressList, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.name),
        b: common_vendor.t(item.phone),
        c: item.isDefault
      }, item.isDefault ? {} : {}, {
        d: common_vendor.t(item.province),
        e: common_vendor.t(item.city),
        f: common_vendor.t(item.district),
        g: common_vendor.t(item.detail),
        h: "90a3874e-0-" + i0,
        i: common_vendor.o(($event) => $options.editAddress(item.id), item.id),
        j: "90a3874e-1-" + i0,
        k: common_vendor.o(($event) => $options.deleteAddress(item.id), item.id),
        l: item.id,
        m: common_vendor.o(($event) => $options.selectAddress(item), item.id)
      });
    }),
    b: common_vendor.p({
      type: "compose",
      size: "18",
      color: "#007AFF"
    }),
    c: common_vendor.p({
      type: "trash",
      size: "18",
      color: "#FF5722"
    }),
    d: $data.addressList.length === 0
  }, $data.addressList.length === 0 ? {} : {}, {
    e: common_vendor.o((...args) => $options.addAddress && $options.addAddress(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-90a3874e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/list.js.map
