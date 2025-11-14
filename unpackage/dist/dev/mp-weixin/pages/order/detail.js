"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const orderId = common_vendor.ref("");
    const order = common_vendor.ref(null);
    const loading = common_vendor.ref(false);
    async function loadOrder() {
      if (!orderId.value) {
        return;
      }
      loading.value = true;
      try {
        const orderData = await utils_apiService.orderApi.getOrderDetail(orderId.value);
        if (orderData) {
          if (orderData.goodsImage && typeof orderData.goodsImage === "string") {
            try {
              const images = JSON.parse(orderData.goodsImage);
              orderData.goodsImage = Array.isArray(images) ? images[0] : images;
            } catch (e) {
            }
          }
          if (orderData.sellerId && !orderData.seller) {
            try {
              const seller = await utils_apiService.userApi.getUserInfo(orderData.sellerId);
              if (seller) {
                orderData.seller = seller;
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/order/detail.vue:122", "加载卖家信息失败:", error);
              orderData.seller = {
                id: orderData.sellerId,
                username: "卖家",
                avatar: "/static/default-avatar.png"
              };
            }
          }
          order.value = orderData;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order/detail.vue:134", "加载订单失败:", error);
        common_vendor.index.showToast({
          title: error.message || "加载订单失败",
          icon: "none",
          duration: 2e3
        });
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
    function getStatusIcon(status) {
      const map = {
        pending: "💰",
        paid: "📦",
        shipped: "🚚",
        completed: "✅",
        cancelled: "❌"
      };
      return map[status] || "ℹ️";
    }
    function getStatusDesc(status) {
      const map = {
        pending: "请尽快完成支付",
        paid: "卖家正在准备发货",
        shipped: "商品正在路上",
        completed: "交易已完成",
        cancelled: "订单已取消"
      };
      return map[status] || "";
    }
    function goToChat(userId) {
      if (!utils_auth.checkLogin()) {
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/message/chat?userId=${userId}`
      });
    }
    async function cancelOrder() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要取消此订单吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_apiService.orderApi.cancelOrder(orderId.value);
              common_vendor.index.showToast({
                title: "订单已取消",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/order/detail.vue:216", "取消订单失败:", error);
              common_vendor.index.showToast({
                title: error.message || "取消订单失败",
                icon: "none"
              });
            }
          }
        }
      });
    }
    async function payOrder() {
      if (!order.value) {
        return;
      }
      common_vendor.index.showModal({
        title: "确认支付",
        content: `确定要支付 ¥${order.value.totalPrice} 吗？`,
        success: async (res) => {
          if (res.confirm) {
            try {
              await utils_apiService.orderApi.payOrder(orderId.value);
              common_vendor.index.showToast({
                title: "支付成功",
                icon: "success"
              });
              setTimeout(() => {
                loadOrder();
              }, 1500);
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/order/detail.vue:249", "支付失败:", error);
              common_vendor.index.showToast({
                title: error.message || "支付失败",
                icon: "none"
              });
            }
          }
        }
      });
    }
    common_vendor.onLoad((options) => {
      if (options && options.id) {
        orderId.value = options.id;
        loadOrder();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: loading.value
      }, loading.value ? {} : {}, {
        b: order.value && !loading.value
      }, order.value && !loading.value ? common_vendor.e({
        c: common_vendor.t(getStatusIcon(order.value.status)),
        d: common_vendor.t(getStatusText(order.value.status)),
        e: common_vendor.t(getStatusDesc(order.value.status)),
        f: order.value.goodsImage,
        g: common_vendor.t(order.value.goodsTitle),
        h: common_vendor.t(order.value.price),
        i: common_vendor.t(order.value.quantity),
        j: common_vendor.t(order.value.id),
        k: common_vendor.t(order.value.createTime),
        l: order.value.payTime
      }, order.value.payTime ? {
        m: common_vendor.t(order.value.payTime)
      } : {}, {
        n: order.value.completeTime
      }, order.value.completeTime ? {
        o: common_vendor.t(order.value.completeTime)
      } : {}, {
        p: order.value.seller
      }, order.value.seller ? {
        q: order.value.seller.avatar || "/static/default-avatar.png",
        r: common_vendor.t(order.value.seller.username || "卖家"),
        s: common_vendor.o(($event) => goToChat(order.value.seller.id))
      } : {}, {
        t: common_vendor.t(order.value.price * order.value.quantity),
        v: common_vendor.t(order.value.totalPrice),
        w: order.value.status === "pending"
      }, order.value.status === "pending" ? {
        x: common_vendor.o(cancelOrder),
        y: common_vendor.o(payOrder)
      } : {}) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6b23c96c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order/detail.js.map
