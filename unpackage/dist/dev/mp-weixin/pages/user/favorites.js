"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockData = require("../../utils/mockData.js");
const _sfc_main = {
  data() {
    return {
      favoritesList: []
    };
  },
  onLoad() {
    this.loadFavorites();
  },
  methods: {
    loadFavorites() {
      this.favoritesList = utils_mockData.getGoodsList({ status: "onSale" }).filter((item) => item.isLiked);
    },
    toggleLike(id) {
      const item = this.favoritesList.find((g) => g.id === id);
      if (item) {
        item.isLiked = false;
        this.favoritesList = this.favoritesList.filter((g) => g.id !== id);
        common_vendor.index.showToast({
          title: "已取消收藏",
          icon: "success"
        });
      }
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/detail?id=${id}`
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
      return days + "天前";
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.f($data.favoritesList, (item, k0, i0) => {
      return {
        a: item.images[0],
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.description),
        d: common_vendor.t(item.price),
        e: common_vendor.t($options.formatTime(item.createTime)),
        f: "fef149ca-0-" + i0,
        g: common_vendor.p({
          type: item.isLiked ? "heart-filled" : "heart",
          size: "20",
          color: item.isLiked ? "#FF5722" : "#999"
        }),
        h: common_vendor.o(($event) => $options.toggleLike(item.id), item.id),
        i: item.id,
        j: common_vendor.o(($event) => $options.goToDetail(item.id), item.id)
      };
    }),
    b: $data.favoritesList.length === 0
  }, $data.favoritesList.length === 0 ? {
    c: common_vendor.p({
      type: "heart",
      size: "80",
      color: "#ddd"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fef149ca"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/favorites.js.map
