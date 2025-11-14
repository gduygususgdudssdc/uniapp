"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "login",
  setup(__props) {
    const form = common_vendor.ref({
      phone: "",
      password: ""
    });
    const loading = common_vendor.ref(false);
    const wechatLoading = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      if (utils_auth.isLoggedIn()) {
        common_vendor.index.showToast({ title: "您已登录", icon: "none" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      }
    });
    async function handleLogin() {
      if (!form.value.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!/^1[3-9]\d{9}$/.test(form.value.phone)) {
        common_vendor.index.showToast({ title: "请输入正确的手机号", icon: "none" });
        return;
      }
      if (!form.value.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (form.value.password.length < 6) {
        common_vendor.index.showToast({ title: "密码至少6位", icon: "none" });
        return;
      }
      if (loading.value) {
        return;
      }
      loading.value = true;
      try {
        const response = await utils_apiService.userApi.login({
          phone: form.value.phone,
          password: form.value.password
        });
        if (response && response.user && response.token) {
          utils_auth.saveUserInfo(response.user, response.token);
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              common_vendor.index.navigateBack();
            } else {
              common_vendor.index.switchTab({ url: "/pages/index/index" });
            }
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/login.vue:126", "登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "登录失败，请检查网络",
          icon: "none",
          duration: 2e3
        });
      } finally {
        loading.value = false;
      }
    }
    function goToRegister() {
      common_vendor.index.navigateTo({ url: "/pages/user/register" });
    }
    function handleForgetPassword() {
      common_vendor.index.showToast({ title: "功能开发中", icon: "none" });
    }
    async function handleWechatLogin() {
      if (wechatLoading.value) {
        return;
      }
      wechatLoading.value = true;
      try {
        const loginRes = await new Promise((resolve, reject) => {
          common_vendor.index.login({
            provider: "weixin",
            success: resolve,
            fail: reject
          });
        });
        if (!loginRes.code) {
          common_vendor.index.showToast({ title: "获取微信登录凭证失败", icon: "none" });
          return;
        }
        let userInfo = null;
        try {
          const userProfileRes = await new Promise((resolve, reject) => {
            common_vendor.index.getUserProfile({
              desc: "用于完善用户资料",
              success: resolve,
              fail: reject
            });
          });
          userInfo = userProfileRes.userInfo;
        } catch (err) {
          common_vendor.index.__f__("log", "at pages/user/login.vue:181", "用户取消授权或获取用户信息失败:", err);
        }
        const response = await utils_apiService.userApi.wechatLogin({
          code: loginRes.code,
          nickName: (userInfo == null ? void 0 : userInfo.nickName) || "",
          avatarUrl: (userInfo == null ? void 0 : userInfo.avatarUrl) || ""
        });
        if (response && response.user && response.token) {
          utils_auth.saveUserInfo(response.user, response.token);
          common_vendor.index.showToast({ title: "登录成功", icon: "success" });
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              common_vendor.index.navigateBack();
            } else {
              common_vendor.index.switchTab({ url: "/pages/index/index" });
            }
          }, 1500);
        } else {
          common_vendor.index.showToast({ title: "登录失败，请重试", icon: "none" });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/login.vue:211", "微信登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || "微信登录失败，请重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        wechatLoading.value = false;
      }
    }
    return (_ctx, _cache) => {
      return {
        a: common_assets._imports_0,
        b: form.value.phone,
        c: common_vendor.o(($event) => form.value.phone = $event.detail.value),
        d: form.value.password,
        e: common_vendor.o(($event) => form.value.password = $event.detail.value),
        f: common_vendor.t(loading.value ? "登录中..." : "登录"),
        g: common_vendor.o(handleLogin),
        h: loading.value,
        i: common_vendor.t(wechatLoading.value ? "登录中..." : "微信快捷登录"),
        j: common_vendor.o(handleWechatLogin),
        k: wechatLoading.value,
        l: common_vendor.o(goToRegister),
        m: common_vendor.o(handleForgetPassword)
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-6163e5ce"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/login.js.map
