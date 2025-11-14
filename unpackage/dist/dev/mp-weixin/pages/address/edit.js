"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "edit",
  setup(__props) {
    const addressId = common_vendor.ref("");
    const form = common_vendor.ref({
      name: "",
      phone: "",
      province: "",
      city: "",
      district: "",
      detail: "",
      isDefault: false
    });
    const regionValue = common_vendor.computed(() => {
      if (form.value.province && form.value.city && form.value.district) {
        return [form.value.province, form.value.city, form.value.district];
      }
      return [];
    });
    const loadAddress = async () => {
      common_vendor.index.__f__("log", "at pages/address/edit.vue:71", "loadAddress 被调用");
      common_vendor.index.__f__("log", "at pages/address/edit.vue:72", "addressId:", addressId.value);
      if (!utils_auth.isLoggedIn()) {
        common_vendor.index.__f__("log", "at pages/address/edit.vue:76", "用户未登录");
        common_vendor.index.showToast({ title: "请先登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateTo({ url: "/pages/user/login" });
        }, 1500);
        return;
      }
      if (!addressId.value) {
        common_vendor.index.__f__("log", "at pages/address/edit.vue:86", "addressId 为空，跳过加载");
        return;
      }
      try {
        common_vendor.index.__f__("log", "at pages/address/edit.vue:91", "开始请求地址信息，ID:", addressId.value);
        const address = await utils_apiService.addressApi.getAddress(addressId.value);
        common_vendor.index.__f__("log", "at pages/address/edit.vue:93", "获取到地址信息:", address);
        if (address) {
          form.value = { ...address };
          common_vendor.index.__f__("log", "at pages/address/edit.vue:97", "地址信息已加载到表单:", form.value);
        } else {
          common_vendor.index.__f__("log", "at pages/address/edit.vue:99", "地址不存在");
          common_vendor.index.showToast({ title: "地址不存在", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/address/edit.vue:103", "获取地址失败:", error);
        common_vendor.index.showToast({ title: "获取地址失败: " + (error.message || "未知错误"), icon: "none", duration: 3e3 });
      }
    };
    common_vendor.onLoad((options) => {
      common_vendor.index.__f__("log", "at pages/address/edit.vue:109", "页面加载，参数:", options);
      if (options && options.id) {
        addressId.value = options.id;
        common_vendor.index.__f__("log", "at pages/address/edit.vue:112", "设置 addressId:", addressId.value);
        loadAddress();
      } else {
        common_vendor.index.__f__("log", "at pages/address/edit.vue:115", "没有地址ID，这是新增地址模式");
      }
    });
    const onRegionChange = (e) => {
      const [province, city, district] = e.detail.value;
      form.value.province = province;
      form.value.city = city;
      form.value.district = district;
    };
    const onDefaultChange = (e) => {
      form.value.isDefault = e.detail.value.length > 0;
    };
    const handleSubmit = () => {
      if (!form.value.name) {
        common_vendor.index.showToast({ title: "请输入收货人姓名", icon: "none" });
        return;
      }
      if (!form.value.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!form.value.province) {
        common_vendor.index.showToast({ title: "请选择所在地区", icon: "none" });
        return;
      }
      if (!form.value.detail) {
        common_vendor.index.showToast({ title: "请输入详细地址", icon: "none" });
        return;
      }
      common_vendor.index.showToast({
        title: "保存成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    };
    return (_ctx, _cache) => {
      return {
        a: form.value.name,
        b: common_vendor.o(($event) => form.value.name = $event.detail.value),
        c: form.value.phone,
        d: common_vendor.o(($event) => form.value.phone = $event.detail.value),
        e: common_vendor.t(form.value.province && form.value.city && form.value.district ? `${form.value.province} ${form.value.city} ${form.value.district}` : "请选择所在地区"),
        f: !form.value.province ? 1 : "",
        g: regionValue.value,
        h: common_vendor.o(onRegionChange),
        i: form.value.detail,
        j: common_vendor.o(($event) => form.value.detail = $event.detail.value),
        k: form.value.isDefault,
        l: common_vendor.o(onDefaultChange),
        m: common_vendor.o(handleSubmit)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-dcb1f0d8"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/address/edit.js.map
