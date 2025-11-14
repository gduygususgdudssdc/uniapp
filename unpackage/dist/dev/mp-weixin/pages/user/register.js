"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        phone: "",
        code: "",
        password: "",
        confirmPassword: ""
      },
      agreed: false,
      countdown: 0,
      codeText: "获取验证码"
    };
  },
  methods: {
    sendCode() {
      if (!this.form.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (this.countdown > 0)
        return;
      this.countdown = 60;
      this.codeText = `${this.countdown}秒后重试`;
      const timer = setInterval(() => {
        this.countdown--;
        if (this.countdown > 0) {
          this.codeText = `${this.countdown}秒后重试`;
        } else {
          this.codeText = "获取验证码";
          clearInterval(timer);
        }
      }, 1e3);
      common_vendor.index.showToast({
        title: "验证码已发送",
        icon: "success"
      });
    },
    onAgreementChange(e) {
      this.agreed = e.detail.value.includes("agree");
    },
    handleRegister() {
      if (!this.form.phone) {
        common_vendor.index.showToast({ title: "请输入手机号", icon: "none" });
        return;
      }
      if (!this.form.code) {
        common_vendor.index.showToast({ title: "请输入验证码", icon: "none" });
        return;
      }
      if (!this.form.password) {
        common_vendor.index.showToast({ title: "请输入密码", icon: "none" });
        return;
      }
      if (this.form.password !== this.form.confirmPassword) {
        common_vendor.index.showToast({ title: "两次密码不一致", icon: "none" });
        return;
      }
      if (!this.agreed) {
        common_vendor.index.showToast({ title: "请同意用户协议", icon: "none" });
        return;
      }
      common_vendor.index.showToast({
        title: "注册成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    },
    goToLogin() {
      common_vendor.index.navigateBack();
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      type: "phone",
      size: "20",
      color: "#999"
    }),
    b: $data.form.phone,
    c: common_vendor.o(($event) => $data.form.phone = $event.detail.value),
    d: common_vendor.p({
      type: "compose",
      size: "20",
      color: "#999"
    }),
    e: $data.form.code,
    f: common_vendor.o(($event) => $data.form.code = $event.detail.value),
    g: common_vendor.t($data.codeText),
    h: common_vendor.o((...args) => $options.sendCode && $options.sendCode(...args)),
    i: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    j: $data.form.password,
    k: common_vendor.o(($event) => $data.form.password = $event.detail.value),
    l: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    m: $data.form.confirmPassword,
    n: common_vendor.o(($event) => $data.form.confirmPassword = $event.detail.value),
    o: $data.agreed,
    p: common_vendor.o((...args) => $options.onAgreementChange && $options.onAgreementChange(...args)),
    q: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    r: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-fd534bf9"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/register.js.map
