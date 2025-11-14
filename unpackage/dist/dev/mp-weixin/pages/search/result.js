"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const _sfc_main = {
  data() {
    return {
      keyword: "",
      currentSort: "",
      showSort: false,
      goodsList: [],
      sortOptions: [
        { label: "综合排序", value: "" },
        { label: "价格从低到高", value: "price_asc" },
        { label: "价格从高到低", value: "price_desc" },
        { label: "最新发布", value: "time_desc" }
      ]
    };
  },
  computed: {
    sortText() {
      const option = this.sortOptions.find((item) => item.value === this.currentSort);
      return option ? option.label : "综合排序";
    }
  },
  onLoad(options) {
    if (options.keyword) {
      this.keyword = options.keyword;
      this.handleSearch();
    }
  },
  methods: {
    async handleSearch() {
      try {
        const result = await utils_apiService.goodsApi.searchGoods(this.keyword, "onSale", 0, 20);
        let list = result.content || result || [];
        if (this.currentSort === "price_asc") {
          list.sort((a, b) => a.price - b.price);
        } else if (this.currentSort === "price_desc") {
          list.sort((a, b) => b.price - a.price);
        } else if (this.currentSort === "time_desc") {
          list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
        }
        list.forEach((item) => {
          if (typeof item.images === "string") {
            try {
              item.images = JSON.parse(item.images);
            } catch (e) {
              item.images = [item.images];
            }
          }
          if (!Array.isArray(item.images)) {
            item.images = [];
          }
        });
        this.goodsList = list;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/search/result.vue:114", "搜索失败:", error);
        common_vendor.index.showToast({ title: "搜索失败", icon: "none" });
        this.goodsList = [];
      }
    },
    selectSort(value) {
      this.currentSort = value;
      this.showSort = false;
      this.handleSearch();
    },
    goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/detail?id=${id}`
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.o((...args) => $options.handleSearch && $options.handleSearch(...args)),
    b: $data.keyword,
    c: common_vendor.o(($event) => $data.keyword = $event.detail.value),
    d: common_vendor.t($options.sortText),
    e: common_vendor.o(($event) => $data.showSort = !$data.showSort),
    f: common_vendor.f($data.goodsList, (item, k0, i0) => {
      return {
        a: item.images[0],
        b: common_vendor.t(item.title),
        c: common_vendor.t(item.description),
        d: common_vendor.t(item.price),
        e: common_vendor.t(item.location),
        f: item.id,
        g: common_vendor.o(($event) => $options.goToDetail(item.id), item.id)
      };
    }),
    g: $data.goodsList.length === 0
  }, $data.goodsList.length === 0 ? {} : {}, {
    h: $data.showSort
  }, $data.showSort ? {
    i: common_vendor.f($data.sortOptions, (item, k0, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.label),
        b: $data.currentSort === item.value
      }, $data.currentSort === item.value ? {} : {}, {
        c: item.value,
        d: $data.currentSort === item.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectSort(item.value), item.value)
      });
    }),
    j: common_vendor.o(() => {
    }),
    k: common_vendor.o(($event) => $data.showSort = false)
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-51958986"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/result.js.map
