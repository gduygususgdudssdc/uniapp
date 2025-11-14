"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "my",
  setup(__props) {
    const goodsList = common_vendor.ref([]);
    const currentTab = common_vendor.ref("onSale");
    const loading = common_vendor.ref(false);
    const tabs = common_vendor.ref([
      { label: "在售", value: "onSale" },
      { label: "已下架", value: "offShelf" },
      { label: "已售出", value: "sold" }
    ]);
    const filterGoods = common_vendor.computed(() => {
      return goodsList.value.filter((item) => item.status === currentTab.value);
    });
    async function loadGoods() {
      if (!utils_auth.checkLogin()) {
        return;
      }
      const userId = utils_auth.getCurrentUserId();
      if (!userId) {
        common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
        return;
      }
      loading.value = true;
      try {
        const goods = await utils_apiService.goodsApi.getMyGoods(userId);
        if (Array.isArray(goods)) {
          goods.forEach((item) => {
            if (item.images && typeof item.images === "string") {
              try {
                item.images = JSON.parse(item.images);
              } catch (e) {
                item.images = [item.images];
              }
            } else if (!Array.isArray(item.images)) {
              item.images = [];
            }
          });
          goodsList.value = goods;
        } else {
          goodsList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/my.vue:109", "加载商品失败:", error);
        common_vendor.index.showToast({
          title: error.message || "加载商品失败",
          icon: "none",
          duration: 2e3
        });
        goodsList.value = [];
      } finally {
        loading.value = false;
      }
    }
    function switchTab(value) {
      currentTab.value = value;
    }
    function getStatusText(status) {
      const statusMap = {
        "onSale": "在售",
        "offShelf": "已下架",
        "sold": "已售出"
      };
      return statusMap[status] || status;
    }
    function goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/detail?id=${id}`
      });
    }
    function editGoods(id) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/edit?id=${id}`
      });
    }
    async function deleteGoods(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除这个商品吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_apiService.goodsApi.deleteGoods(id);
              common_vendor.index.showToast({ title: "删除成功", icon: "success" });
              loadGoods();
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/goods/my.vue:157", "删除商品失败:", error);
              common_vendor.index.showToast({
                title: error.message || "删除失败",
                icon: "none"
              });
            }
          }
        }
      });
    }
    function prepareGoodsForUpdate(goods) {
      const updateData = { ...goods };
      if (Array.isArray(updateData.images)) {
        updateData.images = JSON.stringify(updateData.images);
      }
      delete updateData.createTime;
      return updateData;
    }
    async function offShelf(id) {
      try {
        const goods = goodsList.value.find((item) => item.id === id);
        if (!goods)
          return;
        const updateData = prepareGoodsForUpdate(goods);
        updateData.status = "offShelf";
        await utils_apiService.goodsApi.updateGoods(id, updateData);
        common_vendor.index.showToast({ title: "已下架", icon: "success" });
        loadGoods();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/my.vue:188", "下架商品失败:", error);
        common_vendor.index.showToast({
          title: error.message || "下架失败",
          icon: "none"
        });
      }
    }
    async function onShelf(id) {
      try {
        const goods = goodsList.value.find((item) => item.id === id);
        if (!goods)
          return;
        const updateData = prepareGoodsForUpdate(goods);
        updateData.status = "onSale";
        await utils_apiService.goodsApi.updateGoods(id, updateData);
        common_vendor.index.showToast({ title: "已上架", icon: "success" });
        loadGoods();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/my.vue:207", "上架商品失败:", error);
        common_vendor.index.showToast({
          title: error.message || "上架失败",
          icon: "none"
        });
      }
    }
    common_vendor.onLoad(() => {
      loadGoods();
    });
    common_vendor.onShow(() => {
      if (utils_auth.checkLogin()) {
        loadGoods();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(tabs.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.label),
            b: currentTab.value === item.value ? 1 : "",
            c: item.value,
            d: common_vendor.o(($event) => switchTab(item.value), item.value)
          };
        }),
        b: common_vendor.f(filterGoods.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.images && item.images[0] ? item.images[0] : "/static/default-goods.png",
            b: common_vendor.o(($event) => goToDetail(item.id), item.id),
            c: common_vendor.t(item.title),
            d: common_vendor.o(($event) => goToDetail(item.id), item.id),
            e: common_vendor.t(item.price),
            f: common_vendor.t(getStatusText(item.status)),
            g: common_vendor.n(item.status),
            h: common_vendor.o(($event) => editGoods(item.id), item.id),
            i: common_vendor.o(($event) => deleteGoods(item.id), item.id),
            j: item.status === "onSale"
          }, item.status === "onSale" ? {
            k: common_vendor.o(($event) => offShelf(item.id), item.id)
          } : {}, {
            l: item.status === "offShelf"
          }, item.status === "offShelf" ? {
            m: common_vendor.o(($event) => onShelf(item.id), item.id)
          } : {}, {
            n: item.id
          });
        }),
        c: filterGoods.value.length === 0 && !loading.value
      }, filterGoods.value.length === 0 && !loading.value ? {} : {}, {
        d: loading.value
      }, loading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-deb8bc6e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/goods/my.js.map
