"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "detail",
  setup(__props) {
    const goodsId = common_vendor.ref("");
    const goods = common_vendor.ref(null);
    const sellerInfo = common_vendor.ref({
      id: null,
      username: "卖家",
      avatar: "/static/default-avatar.png"
    });
    async function loadGoods() {
      try {
        const goodsData = await utils_apiService.goodsApi.getGoodsDetail(goodsId.value);
        if (goodsData) {
          if (typeof goodsData.images === "string") {
            try {
              goodsData.images = JSON.parse(goodsData.images);
            } catch (e) {
              goodsData.images = [goodsData.images];
            }
          }
          if (!Array.isArray(goodsData.images)) {
            goodsData.images = [];
          }
          goodsData.isLiked = false;
          if (utils_auth.checkLogin()) {
            try {
              const userId = utils_auth.getCurrentUserId();
              if (userId) {
                const isFavorite = await utils_apiService.favoriteApi.checkFavorite(userId, goodsId.value);
                goodsData.isLiked = isFavorite;
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/goods/detail.vue:95", "检查收藏状态失败:", error);
            }
          }
          goods.value = goodsData;
          if (goodsData.sellerId) {
            try {
              const seller = await utils_apiService.userApi.getUserInfo(goodsData.sellerId);
              if (seller) {
                sellerInfo.value = seller;
              }
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/goods/detail.vue:109", "加载卖家信息失败:", error);
              sellerInfo.value = {
                id: goodsData.sellerId,
                username: "卖家",
                avatar: "/static/default-avatar.png"
              };
            }
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/detail.vue:120", "加载商品失败:", error);
        common_vendor.index.showToast({ title: "加载商品失败", icon: "none" });
      }
    }
    async function createOrder() {
      if (!utils_auth.checkLogin()) {
        return;
      }
      const buyerId = utils_auth.getCurrentUserId();
      if (!buyerId) {
        common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
        return;
      }
      if (!goods.value) {
        common_vendor.index.showToast({ title: "商品信息不存在", icon: "none" });
        return;
      }
      try {
        const order = await utils_apiService.orderApi.createOrder({
          goodsId: goodsId.value,
          buyerId,
          quantity: 1
        });
        if (order && order.id) {
          common_vendor.index.showToast({
            title: "订单创建成功",
            icon: "success",
            duration: 1500
          });
          setTimeout(() => {
            common_vendor.index.redirectTo({
              url: `/pages/order/detail?id=${order.id}`
            });
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: "订单创建失败", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/detail.vue:166", "创建订单失败:", error);
        common_vendor.index.showToast({
          title: error.message || "创建订单失败",
          icon: "none",
          duration: 2e3
        });
      }
    }
    async function toggleLike() {
      if (!utils_auth.checkLogin()) {
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        return;
      }
      if (!goods.value)
        return;
      const userId = utils_auth.getCurrentUserId();
      if (!userId) {
        common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
        return;
      }
      try {
        if (goods.value.isLiked) {
          await utils_apiService.favoriteApi.removeFavorite(userId, goodsId.value);
          goods.value.isLiked = false;
          if (goods.value.likes > 0) {
            goods.value.likes--;
          }
          common_vendor.index.showToast({ title: "已取消收藏", icon: "success" });
        } else {
          await utils_apiService.favoriteApi.addFavorite(userId, goodsId.value);
          goods.value.isLiked = true;
          goods.value.likes++;
          common_vendor.index.showToast({ title: "已收藏", icon: "success" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/detail.vue:206", "收藏操作失败:", error);
        common_vendor.index.showToast({
          title: error.message || "操作失败",
          icon: "none"
        });
      }
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
    function handleBuy() {
      if (!utils_auth.checkLogin()) {
        return;
      }
      if (!goods.value) {
        common_vendor.index.showToast({ title: "商品信息不存在", icon: "none" });
        return;
      }
      common_vendor.index.showModal({
        title: "确认购买",
        content: `确定要购买"${goods.value.title}"吗？
价格：¥${goods.value.price}`,
        success: (res) => {
          if (res.confirm) {
            createOrder();
          }
        }
      });
    }
    common_vendor.onLoad(async (options) => {
      if (options && options.id) {
        goodsId.value = options.id;
        await loadGoods();
      }
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: goods.value
      }, goods.value ? common_vendor.e({
        b: common_vendor.f(goods.value.images, (img, index, i0) => {
          return {
            a: img,
            b: index
          };
        }),
        c: common_vendor.t(goods.value.price),
        d: goods.value.originalPrice
      }, goods.value.originalPrice ? {
        e: common_vendor.t(goods.value.originalPrice)
      } : {}, {
        f: common_vendor.t(goods.value.title),
        g: common_vendor.t(goods.value.condition),
        h: common_vendor.t(goods.value.views),
        i: common_vendor.t(goods.value.likes),
        j: goods.value.sellerId
      }, goods.value.sellerId ? {
        k: sellerInfo.value.avatar || "/static/default-avatar.png",
        l: common_vendor.t(sellerInfo.value.username || "卖家"),
        m: common_vendor.t(goods.value.location || "未知地区"),
        n: common_vendor.o(($event) => goToChat(goods.value.sellerId))
      } : {}, {
        o: common_vendor.t(goods.value.description),
        p: common_vendor.t(goods.value.isLiked ? "❤️" : "🤍"),
        q: common_vendor.o(toggleLike),
        r: common_vendor.o(handleBuy)
      }) : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-adbe0a1d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/goods/detail.js.map
