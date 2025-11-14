"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const categoryId = common_vendor.ref("");
    const categoryName = common_vendor.ref("");
    const currentSort = common_vendor.ref("");
    const showSort = common_vendor.ref(false);
    const showCategory = common_vendor.ref(false);
    const goodsList = common_vendor.ref([]);
    const sortOptions = common_vendor.ref([
      { label: "综合排序", value: "" },
      { label: "价格从低到高", value: "price_asc" },
      { label: "价格从高到低", value: "price_desc" },
      { label: "最新发布", value: "time_desc" }
    ]);
    const sortText = common_vendor.computed(() => {
      const option = sortOptions.value.find((item) => item.value === currentSort.value);
      return option ? option.label : "综合排序";
    });
    async function loadGoods() {
      try {
        const params = {
          status: "onSale",
          page: 0,
          size: 20
        };
        if (categoryId.value) {
          params.categoryId = categoryId.value;
        }
        const result = await utils_apiService.goodsApi.getGoodsList(params);
        let list = result.content || result || [];
        if (currentSort.value === "price_asc") {
          list.sort((a, b) => a.price - b.price);
        } else if (currentSort.value === "price_desc") {
          list.sort((a, b) => b.price - a.price);
        } else if (currentSort.value === "time_desc") {
          list.sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
        }
        for (let item of list) {
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
          if (item.sellerId && !item.seller) {
            try {
              const seller = await utils_apiService.userApi.getUserInfo(item.sellerId);
              if (seller) {
                item.seller = seller;
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/goods/list.vue:128", "加载卖家信息失败:", error);
              item.seller = {
                id: item.sellerId,
                username: "卖家",
                avatar: "/static/default-avatar.png"
              };
            }
          }
        }
        goodsList.value = list;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/list.vue:141", "加载商品失败:", error);
        common_vendor.index.showToast({ title: "加载商品失败", icon: "none" });
        goodsList.value = [];
      }
    }
    function selectSort(value) {
      currentSort.value = value;
      showSort.value = false;
      loadGoods();
    }
    function goToDetail(id) {
      common_vendor.index.navigateTo({ url: `/pages/goods/detail?id=${id}` });
    }
    function goToChat(sellerId) {
      if (!utils_auth.checkLogin()) {
        return;
      }
      if (!sellerId) {
        common_vendor.index.showToast({ title: "卖家信息不存在", icon: "none" });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/message/chat?userId=${sellerId}`
      });
    }
    function formatTime(time) {
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
    common_vendor.onLoad(async (options) => {
      if (options && options.categoryId) {
        categoryId.value = options.categoryId;
        try {
          const category = await utils_apiService.categoryApi.getCategoryDetail(categoryId.value);
          if (category) {
            categoryName.value = category.name;
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/goods/list.vue:198", "加载分类信息失败:", error);
        }
      }
      await loadGoods();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.t(sortText.value),
        b: common_vendor.o(($event) => showSort.value = !showSort.value),
        c: common_vendor.t(categoryName.value || "全部分类"),
        d: common_vendor.o(($event) => showCategory.value = !showCategory.value),
        e: common_vendor.f(goodsList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.images && item.images[0] ? item.images[0] : "/static/default-goods.png",
            b: common_vendor.o(($event) => goToDetail(item.id), item.id),
            c: common_vendor.t(item.title),
            d: common_vendor.o(($event) => goToDetail(item.id), item.id),
            e: common_vendor.t(item.description),
            f: common_vendor.o(($event) => goToDetail(item.id), item.id),
            g: item.seller
          }, item.seller ? {
            h: item.seller.avatar || "/static/default-avatar.png",
            i: common_vendor.t(item.seller.username || "卖家"),
            j: common_vendor.o(($event) => goToChat(item.seller.id), item.id)
          } : {}, {
            k: common_vendor.t(item.price),
            l: common_vendor.t(item.location),
            m: common_vendor.t(formatTime(item.createTime)),
            n: item.id
          });
        }),
        f: goodsList.value.length === 0
      }, goodsList.value.length === 0 ? {} : {}, {
        g: showSort.value
      }, showSort.value ? {
        h: common_vendor.f(sortOptions.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.label),
            b: currentSort.value === item.value
          }, currentSort.value === item.value ? {} : {}, {
            c: item.value,
            d: currentSort.value === item.value ? 1 : "",
            e: common_vendor.o(($event) => selectSort(item.value), item.value)
          });
        }),
        i: common_vendor.o(() => {
        }),
        j: common_vendor.o(($event) => showSort.value = false)
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-7f2f18c6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/goods/list.js.map
