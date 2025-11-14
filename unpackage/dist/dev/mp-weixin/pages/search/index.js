"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      hasSearched: false,
      historyList: ["iPhone", "MacBook", "运动鞋", "相机"],
      hotKeywords: ["手机", "电脑", "相机", "耳机", "运动鞋", "背包", "手表", "键盘"]
    };
  },
  methods: {
    handleSearch() {
      if (!this.keyword.trim())
        return;
      if (!this.historyList.includes(this.keyword)) {
        this.historyList.unshift(this.keyword);
        if (this.historyList.length > 10) {
          this.historyList.pop();
        }
      }
      common_vendor.index.navigateTo({
        url: `/pages/search/result?keyword=${this.keyword}`
      });
    },
    searchKeyword(keyword) {
      this.keyword = keyword;
      this.handleSearch();
    },
    handleCancel() {
      common_vendor.index.navigateBack();
    },
    clearHistory() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要清除搜索历史吗？",
        success: (res) => {
          if (res.confirm) {
            this.historyList = [];
          }
        }
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.keyword,
    c: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    d: $data.keyword
  }, $data.keyword ? {
    e: common_vendor.o(($event) => $data.keyword = "")
  } : {}, {
    f: common_vendor.o((...args) => $options.handleCancel && $options.handleCancel(...args)),
    g: !$data.hasSearched && $data.historyList.length > 0
  }, !$data.hasSearched && $data.historyList.length > 0 ? {
    h: common_vendor.o((...args) => $options.clearHistory && $options.clearHistory(...args)),
    i: common_vendor.f($data.historyList, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.searchKeyword(item), index)
      };
    })
  } : {}, {
    j: !$data.hasSearched
  }, !$data.hasSearched ? {
    k: common_vendor.f($data.hotKeywords, (item, index, i0) => {
      return {
        a: common_vendor.t(item),
        b: index,
        c: common_vendor.o(($event) => $options.searchKeyword(item), index)
      };
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2dab939d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/index.js.map
