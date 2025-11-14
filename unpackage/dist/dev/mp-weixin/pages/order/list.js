"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "list",
  setup(__props) {
    const orderList = common_vendor.ref([]);
    const userId = common_vendor.ref(null);
    const currentTab = common_vendor.ref("all");
    const loading = common_vendor.ref(false);
    const tabs = common_vendor.ref([
      { label: "全部", value: "all" },
      { label: "待付款", value: "pending" },
      { label: "待发货", value: "paid" },
      { label: "已完成", value: "completed" }
    ]);
    async function loadOrders() {
      if (!utils_auth.checkLogin()) {
        return;
      }
      const currentUserId = utils_auth.getCurrentUserId();
      if (!currentUserId) {
        common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
        return;
      }
      userId.value = currentUserId;
      loading.value = true;
      try {
        const status = currentTab.value === "all" ? "" : currentTab.value;
        const orders = await utils_apiService.orderApi.getOrderList(currentUserId, status);
        if (Array.isArray(orders)) {
          orderList.value = orders.map((order) => {
            if (order.goodsImage && typeof order.goodsImage === "string") {
              try {
                const images = JSON.parse(order.goodsImage);
                order.goodsImage = Array.isArray(images) ? images[0] : images;
              } catch (e) {
              }
            }
            return order;
          });
        } else {
          orderList.value = [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/list.vue:107", "加载订单失败:", error);
        common_vendor.index.showToast({
          title: error.message || "加载订单失败",
          icon: "none",
          duration: 2e3
        });
        orderList.value = [];
      } finally {
        loading.value = false;
      }
    }
    function getStatusText(status) {
      const map = {
        pending: "待付款",
        paid: "待发货",
        shipped: "已发货",
        completed: "已完成",
        cancelled: "已取消"
      };
      return map[status] || "";
    }
    function switchTab(value) {
      currentTab.value = value;
      loadOrders();
    }
    function goToDetail(id) {
      common_vendor.index.navigateTo({
        url: `/pages/order/detail?id=${id}`
      });
    }
    async function cancelOrder(id) {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消此订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_apiService.orderApi.cancelOrder(id);
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
              loadOrders();
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/order/list.vue:156", "取消订单失败:", error);
              common_vendor.index.showToast({
                title: error.message || "取消订单失败",
                icon: "none"
              });
            }
          }
        }
      });
    }
    async function payOrder(id) {
      try {
        await utils_apiService.orderApi.payOrder(id);
        common_vendor.index.showToast({
          title: "支付成功",
          icon: "success"
        });
        loadOrders();
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/list.vue:177", "支付失败:", error);
        common_vendor.index.showToast({
          title: error.message || "支付失败",
          icon: "none"
        });
      }
    }
    common_vendor.onLoad(() => {
      loadOrders();
    });
    common_vendor.onShow(() => {
      loadOrders();
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
        b: common_vendor.f(orderList.value, (item, k0, i0) => {
          return common_vendor.e({
            a: common_vendor.t(item.id),
            b: common_vendor.t(getStatusText(item.status)),
            c: common_vendor.n(item.status),
            d: item.goodsImage,
            e: common_vendor.t(item.goodsTitle),
            f: common_vendor.t(item.price),
            g: common_vendor.t(item.quantity),
            h: common_vendor.t(item.createTime),
            i: common_vendor.t(item.totalPrice),
            j: item.status === "pending"
          }, item.status === "pending" ? {
            k: common_vendor.o(($event) => cancelOrder(item.id), item.id),
            l: common_vendor.o(($event) => payOrder(item.id), item.id)
          } : {}, {
            m: item.id,
            n: common_vendor.o(($event) => goToDetail(item.id), item.id)
          });
        }),
        c: orderList.value.length === 0 && !loading.value
      }, orderList.value.length === 0 && !loading.value ? {} : {}, {
        d: loading.value
      }, loading.value ? {} : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-456ecf67"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/list.js.map
