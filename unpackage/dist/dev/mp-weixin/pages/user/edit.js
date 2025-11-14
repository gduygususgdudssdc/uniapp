"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
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
    common_vendor.onLoad((options) => {
      if (options.id) {
        addressId.value = options.id;
        loadAddress();
      }
    });
    const loadAddress = async () => {
      try {
        const address = await utils_apiService.addressApi.getAddress(addressId.value);
        if (address) {
          form.value = {
            name: address.name || "",
            phone: address.phone || "",
            province: address.province || "",
            city: address.city || "",
            district: address.district || "",
            detail: address.detail || "",
            isDefault: address.isDefault || false
          };
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/edit.vue:86", "获取地址失败:", error);
        common_vendor.index.showToast({ title: "加载地址失败", icon: "none" });
      }
    };
    const onRegionChange = (e) => {
      const [province, city, district] = e.detail.value;
      form.value.province = province;
      form.value.city = city;
      form.value.district = district;
    };
    const onDefaultChange = (e) => {
      form.value.isDefault = Array.isArray(e.detail.value) ? e.detail.value.length > 0 : e.detail.value;
    };
    const handleSubmit = async () => {
      if (!form.value.name.trim()) {
        common_vendor.index.showToast({ title: "请输入收货人姓名", icon: "none" });
        return;
      }
      const phoneReg = /^1[3-9]\d{9}$/;
      if (!form.value.phone.trim() || !phoneReg.test(form.value.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!form.value.province || !form.value.city || !form.value.district) {
        common_vendor.index.showToast({ title: "请选择所在地区", icon: "none" });
        return;
      }
      if (!form.value.detail.trim()) {
        common_vendor.index.showToast({ title: "请输入详细地址", icon: "none" });
        return;
      }
      const submitData = {
        id: addressId.value,
        // 关键：传递地址ID，告知接口是修改操作
        ...form.value
      };
      try {
        await utils_apiService.addressApi.updateAddress(submitData);
        common_vendor.index.showToast({ title: "修改成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/edit.vue:138", "修改地址失败:", error);
        common_vendor.index.showToast({ title: "修改失败，请重试", icon: "none" });
      }
    };
    return (_ctx, _cache) => {
      return {
        a: form.value.name,
        b: common_vendor.o(($event) => form.value.name = $event.detail.value),
        c: form.value.phone,
        d: common_vendor.o(($event) => form.value.phone = $event.detail.value),
        e: common_vendor.t(form.value.province && form.value.city && form.value.district ? `${form.value.province} ${form.value.city} ${form.value.district}` : "请选择所在地区"),
        f: !form.value.province ? 1 : "",
        g: common_vendor.p({
          type: "arrowright",
          size: "16",
          color: "#999"
        }),
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
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-590d0314"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/edit.js.map
