"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const banners = common_vendor.ref([]);
    const bannerList = common_vendor.ref([]);
    const currentIndex = common_vendor.ref(0);
    const categories = common_vendor.ref([]);
    const recommendGoods = common_vendor.ref([]);
    const latestGoods = common_vendor.ref([]);
    function onSwiperChange(e) {
      currentIndex.value = e.detail.current;
    }
    async function loadData() {
      try {
        try {
          const list = await utils_apiService.bannerApi.getBannerList();
          bannerList.value = list;
          banners.value = list.map((banner) => banner.imageUrl);
        } catch (error) {
          common_vendor.index.__f__("error", "at pages/index/index.vue:141", "加载Banner失败:", error);
          banners.value = [];
        }
        const categoryList = await utils_apiService.categoryApi.getCategoryList();
        categories.value = categoryList.slice(0, 8);
        const recommendResult = await utils_apiService.goodsApi.getGoodsList({
          status: "onSale",
          page: 0,
          size: 6
        });
        recommendGoods.value = recommendResult.content || recommendResult;
        const latestResult = await utils_apiService.goodsApi.getGoodsList({
          status: "onSale",
          page: 0,
          size: 5
        });
        latestGoods.value = latestResult.content || latestResult;
        await processGoodsImages(recommendGoods.value);
        await processGoodsImages(latestGoods.value);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/index/index.vue:170", "加载数据失败:", error);
        common_vendor.index.showToast({ title: "加载数据失败", icon: "none" });
      }
    }
    async function processGoodsImages(goodsList) {
      if (!Array.isArray(goodsList))
        return;
      for (let item of goodsList) {
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
            common_vendor.index.__f__("error", "at pages/index/index.vue:199", "加载卖家信息失败:", error);
            item.seller = {
              id: item.sellerId,
              username: "卖家",
              avatar: "/static/default-avatar.png"
            };
          }
        }
      }
    }
    function handleBannerClick(index) {
      const banner = bannerList.value[index];
      if (banner && banner.linkUrl) {
        common_vendor.index.navigateTo({ url: banner.linkUrl });
      }
    }
    function goToSearch() {
      common_vendor.index.navigateTo({ url: "/pages/search/index" });
    }
    function goToCategory(categoryId) {
      common_vendor.index.navigateTo({ url: `/pages/goods/list?categoryId=${categoryId}` });
    }
    function goToGoodsList() {
      common_vendor.index.navigateTo({ url: "/pages/goods/list" });
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
      if (!time)
        return "";
      const date = new Date(time);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 6e4);
      const hours = Math.floor(diff / 36e5);
      const days = Math.floor(diff / 864e5);
      if (minutes < 1)
        return "刚刚";
      if (minutes < 60)
        return `${minutes}分钟前`;
      if (hours < 24)
        return `${hours}小时前`;
      if (days < 7)
        return `${days}天前`;
      return `${date.getMonth() + 1}-${date.getDate()}`;
    }
    common_vendor.onLoad(() => {
      loadData();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.o(goToSearch),
        b: banners.value.length > 0
      }, banners.value.length > 0 ? {
        c: common_vendor.f(banners.value, (banner, index, i0) => {
          return {
            a: banner,
            b: currentIndex.value === index ? 1 : "",
            c: common_vendor.o(($event) => handleBannerClick(index), index),
            d: index
          };
        })
      } : {}, {
        d: currentIndex.value,
        e: common_vendor.o(onSwiperChange),
        f: common_vendor.f(categories.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.name),
            c: item.id,
            d: common_vendor.o(($event) => goToCategory(item.id), item.id)
          };
        }),
        g: common_vendor.o(goToGoodsList),
        h: common_vendor.f(recommendGoods.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.images && item.images[0] ? item.images[0] : "",
            b: common_vendor.o(($event) => goToDetail(item.id), item.id),
            c: common_vendor.t(item.title),
            d: common_vendor.o(($event) => goToDetail(item.id), item.id),
            e: item.seller
          }, item.seller ? {
            f: common_vendor.t(item.seller.username || "卖家"),
            g: common_vendor.o(($event) => goToChat(item.seller.id), item.id)
          } : {}, {
            h: common_vendor.t(item.price),
            i: common_vendor.t(item.location),
            j: item.id
          });
        }),
        i: common_vendor.o(goToGoodsList),
        j: common_vendor.f(latestGoods.value, (item, k0, i0) => {
          return common_vendor.e({
            a: item.images && item.images[0] ? item.images[0] : "",
            b: common_vendor.o(($event) => goToDetail(item.id), item.id),
            c: common_vendor.t(item.title),
            d: common_vendor.o(($event) => goToDetail(item.id), item.id),
            e: common_vendor.t(item.description),
            f: common_vendor.o(($event) => goToDetail(item.id), item.id),
            g: item.seller
          }, item.seller ? {
            h: common_vendor.t(item.seller.username || "卖家"),
            i: common_vendor.o(($event) => goToChat(item.seller.id), item.id)
          } : {}, {
            j: common_vendor.t(item.price),
            k: common_vendor.t(formatTime(item.createTime)),
            l: item.id
          });
        })
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-1cf27b2a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/index/index.js.map
