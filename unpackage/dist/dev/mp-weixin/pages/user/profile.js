"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "profile",
  setup(__props) {
    const userInfo = common_vendor.ref({
      id: null,
      username: "未登录",
      avatar: "",
      level: "V1",
      score: 0,
      phone: "",
      email: "",
      address: ""
    });
    const myGoodsCount = common_vendor.ref(0);
    const favoritesCount = common_vendor.ref(0);
    const ordersCount = common_vendor.ref(0);
    async function loadData() {
      if (!utils_auth.isLoggedIn()) {
        userInfo.value = {
          id: null,
          username: "未登录",
          avatar: "https://i.pravatar.cc/100?img=0",
          level: "V1",
          score: 0,
          phone: "",
          email: "",
          address: ""
        };
        myGoodsCount.value = 0;
        favoritesCount.value = 0;
        ordersCount.value = 0;
        return;
      }
      try {
        const userId = utils_auth.getCurrentUserId();
        if (!userId) {
          return;
        }
        const currentUser = utils_auth.getCurrentUser();
        if (currentUser) {
          userInfo.value = { ...currentUser };
          try {
            const userData = await utils_apiService.userApi.getUserInfo(userId);
            if (userData) {
              userInfo.value = { ...userData };
              common_vendor.index.setStorageSync("userInfo", userData);
            }
          } catch (error) {
            common_vendor.index.__f__("error", "at pages/user/profile.vue:143", "获取用户信息失败:", error);
          }
        }
        try {
          const myGoods = await utils_apiService.goodsApi.getMyGoods(userId);
          myGoodsCount.value = Array.isArray(myGoods) ? myGoods.length : 0;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/user/profile.vue:153", "获取我的商品失败:", error);
        }
        try {
          const orders = await utils_apiService.orderApi.getOrderList(userId);
          ordersCount.value = Array.isArray(orders) ? orders.length : 0;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/user/profile.vue:161", "获取订单列表失败:", error);
        }
        try {
          const count = await utils_apiService.favoriteApi.getFavoriteCount(userId);
          favoritesCount.value = count || 0;
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/user/profile.vue:168", "获取收藏数量失败:", error);
          favoritesCount.value = 0;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/profile.vue:173", "加载数据失败:", error);
      }
    }
    function handleLogout() {
      utils_auth.logout();
    }
    common_vendor.onLoad(() => {
      loadData();
    });
    common_vendor.onShow(() => {
      loadData();
    });
    const goToEdit = () => {
      if (!utils_auth.checkLogin())
        return;
      common_vendor.index.navigateTo({ url: "/pages/user/updata" });
    };
    const goToMyGoods = () => {
      if (!utils_auth.checkLogin())
        return;
      common_vendor.index.navigateTo({ url: "/pages/goods/my" });
    };
    const goToFavorites = () => {
      if (!utils_auth.checkLogin())
        return;
      common_vendor.index.navigateTo({ url: "/pages/user/favorites" });
    };
    const goToOrders = () => {
      if (!utils_auth.checkLogin())
        return;
      common_vendor.index.navigateTo({ url: "/pages/order/list" });
    };
    const goToAddress = () => {
      if (!utils_auth.checkLogin())
        return;
      common_vendor.index.navigateTo({ url: "/pages/address/list" });
    };
    const goToSettings = () => {
      common_vendor.index.navigateTo({ url: "/pages/settings/index" });
    };
    const goToHelp = () => {
      common_vendor.index.navigateTo({ url: "/pages/help/index" });
    };
    const goToFeedback = () => {
      common_vendor.index.navigateTo({ url: "/pages/feedback/index" });
    };
    const goToAbout = () => {
      common_vendor.index.navigateTo({ url: "/pages/about/index" });
    };
    return (_ctx, _cache) => {
      return {
        a: userInfo.value.avatar || "/static/default-avatar.png",
        b: common_vendor.o(goToEdit),
        c: common_vendor.t(userInfo.value.username),
        d: common_vendor.t(userInfo.value.level),
        e: common_vendor.o(goToEdit),
        f: common_vendor.o(goToEdit),
        g: common_vendor.t(myGoodsCount.value),
        h: common_vendor.o(goToMyGoods),
        i: common_vendor.t(favoritesCount.value),
        j: common_vendor.o(goToFavorites),
        k: common_vendor.t(ordersCount.value),
        l: common_vendor.o(goToOrders),
        m: common_vendor.o(goToOrders),
        n: common_vendor.o(goToMyGoods),
        o: common_vendor.o(goToFavorites),
        p: common_vendor.o(goToAddress),
        q: common_vendor.o(goToSettings),
        r: common_vendor.o(goToHelp),
        s: common_vendor.o(goToFeedback),
        t: common_vendor.o(goToAbout),
        v: common_vendor.o(handleLogout)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-036958a5"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/profile.js.map
