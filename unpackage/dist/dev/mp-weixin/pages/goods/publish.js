"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "publish",
  setup(__props) {
    const categoryOptions = common_vendor.ref([]);
    const categoryIndex = common_vendor.ref(-1);
    const conditionOptions = common_vendor.ref(["全新", "99新", "95新", "9成新", "8成新", "7成新", "6成新以下"]);
    const conditionIndex = common_vendor.ref(-1);
    const form = common_vendor.ref({
      title: "",
      categoryId: null,
      categoryName: "",
      images: [],
      price: "",
      originalPrice: "",
      condition: "",
      location: "",
      description: ""
    });
    async function loadCategories() {
      try {
        const categories = await utils_apiService.categoryApi.getCategoryList();
        const allCategories = [];
        if (Array.isArray(categories)) {
          categories.forEach((category) => {
            allCategories.push({
              id: category.id,
              name: category.name
            });
            if (category.children && Array.isArray(category.children)) {
              category.children.forEach((subCategory) => {
                allCategories.push({
                  id: subCategory.id,
                  name: `${category.name} - ${subCategory.name}`
                });
              });
            }
          });
        }
        categoryOptions.value = allCategories;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/publish.vue:140", "加载分类失败:", error);
        common_vendor.index.showToast({ title: "加载分类失败", icon: "none" });
      }
    }
    function onCategoryChange(e) {
      const index = e.detail.value;
      categoryIndex.value = index;
      if (categoryOptions.value[index]) {
        const selectedCategory = categoryOptions.value[index];
        form.value.categoryId = selectedCategory.id;
        form.value.categoryName = selectedCategory.name;
      }
    }
    function onConditionChange(e) {
      const index = e.detail.value;
      conditionIndex.value = index;
      if (conditionOptions.value[index]) {
        form.value.condition = conditionOptions.value[index];
      }
    }
    function chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - form.value.images.length,
        success: (res) => {
          form.value.images = [...form.value.images, ...res.tempFilePaths];
        }
      });
    }
    function deleteImage(index) {
      form.value.images.splice(index, 1);
    }
    async function handleSubmit() {
      if (!form.value.title) {
        common_vendor.index.showToast({ title: "请输入商品标题", icon: "none" });
        return;
      }
      if (!form.value.categoryId) {
        common_vendor.index.showToast({ title: "请选择商品分类", icon: "none" });
        return;
      }
      if (!form.value.images || form.value.images.length === 0) {
        common_vendor.index.showToast({ title: "请至少上传一张图片", icon: "none" });
        return;
      }
      if (!form.value.price) {
        common_vendor.index.showToast({ title: "请输入售价", icon: "none" });
        return;
      }
      if (!form.value.condition) {
        common_vendor.index.showToast({ title: "请选择成色", icon: "none" });
        return;
      }
      if (!form.value.location) {
        common_vendor.index.showToast({ title: "请输入所在地区", icon: "none" });
        return;
      }
      if (!utils_auth.checkLogin()) {
        return;
      }
      const userId = utils_auth.getCurrentUserId();
      if (!userId) {
        common_vendor.index.showToast({ title: "获取用户信息失败", icon: "none" });
        return;
      }
      try {
        const submitData = {
          title: form.value.title,
          categoryId: form.value.categoryId,
          categoryName: form.value.categoryName,
          images: JSON.stringify(form.value.images),
          // 转换为JSON字符串
          price: parseFloat(form.value.price),
          originalPrice: form.value.originalPrice ? parseFloat(form.value.originalPrice) : null,
          condition: form.value.condition,
          location: form.value.location,
          description: form.value.description || "",
          sellerId: userId
        };
        await utils_apiService.goodsApi.createGoods(submitData);
        common_vendor.index.showToast({ title: "发布成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/goods/publish.vue:251", "发布商品失败:", error);
        common_vendor.index.showToast({
          title: error.message || "发布失败",
          icon: "none",
          duration: 2e3
        });
      }
    }
    common_vendor.onLoad(() => {
      loadCategories();
    });
    return (_ctx, _cache) => {
      return common_vendor.e({
        a: form.value.title,
        b: common_vendor.o(($event) => form.value.title = $event.detail.value),
        c: common_vendor.t(form.value.categoryName || "请选择分类"),
        d: !form.value.categoryName ? 1 : "",
        e: categoryOptions.value,
        f: categoryIndex.value,
        g: common_vendor.o(onCategoryChange),
        h: common_vendor.f(form.value.images, (img, index, i0) => {
          return {
            a: img,
            b: common_vendor.o(($event) => deleteImage(index), index),
            c: index
          };
        }),
        i: form.value.images.length < 9
      }, form.value.images.length < 9 ? {
        j: common_vendor.o(chooseImage)
      } : {}, {
        k: form.value.price,
        l: common_vendor.o(($event) => form.value.price = $event.detail.value),
        m: form.value.originalPrice,
        n: common_vendor.o(($event) => form.value.originalPrice = $event.detail.value),
        o: common_vendor.t(form.value.condition || "请选择成色"),
        p: !form.value.condition ? 1 : "",
        q: conditionOptions.value,
        r: conditionIndex.value,
        s: common_vendor.o(onConditionChange),
        t: form.value.location,
        v: common_vendor.o(($event) => form.value.location = $event.detail.value),
        w: form.value.description,
        x: common_vendor.o(($event) => form.value.description = $event.detail.value),
        y: common_vendor.t((form.value.description || "").length),
        z: common_vendor.o(handleSubmit)
      });
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-64ea4b46"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/goods/publish.js.map
