"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const _sfc_main = {
  __name: "index",
  setup(__props) {
    const categories = common_vendor.ref([]);
    const currentCategory = common_vendor.ref(null);
    const subcategories = common_vendor.ref([]);
    const currentSubcategories = common_vendor.computed(() => {
      return subcategories.value;
    });
    async function loadCategories() {
      try {
        const categoryList = await utils_apiService.categoryApi.getCategoryList();
        categories.value = categoryList || [];
        if (categories.value.length > 0) {
          currentCategory.value = categories.value[0].id;
          await loadSubcategories(currentCategory.value);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/category/index.vue:53", "加载分类失败:", error);
        common_vendor.index.showToast({ title: "加载分类失败", icon: "none" });
      }
    }
    async function loadSubcategories(parentId) {
      try {
        const subcategoryList = await utils_apiService.categoryApi.getCategoryList(parentId);
        subcategories.value = subcategoryList || [];
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/category/index.vue:63", "加载子分类失败:", error);
        subcategories.value = [];
      }
    }
    function selectCategory(id) {
      currentCategory.value = id;
      loadSubcategories(id);
    }
    function goToGoodsList(categoryId) {
      common_vendor.index.navigateTo({
        url: `/pages/goods/list?categoryId=${categoryId}`
      });
    }
    function getSubcategoryIcon(name) {
      return "📦";
    }
    common_vendor.onLoad(() => {
      loadCategories();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: common_vendor.f(categories.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(item.icon),
            b: common_vendor.t(item.name),
            c: currentCategory.value === item.id ? 1 : "",
            d: item.id,
            e: common_vendor.o(($event) => selectCategory(item.id), item.id)
          };
        }),
        b: currentSubcategories.value.length > 0
      }, currentSubcategories.value.length > 0 ? {
        c: common_vendor.f(currentSubcategories.value, (item, k0, i0) => {
          return {
            a: common_vendor.t(getSubcategoryIcon(item.name)),
            b: common_vendor.t(item.name),
            c: item.id,
            d: common_vendor.o(($event) => goToGoodsList(item.id), item.id)
          };
        })
      } : {});
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-3cdc7548"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/category/index.js.map
