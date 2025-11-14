"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      form: {
        type: "",
        content: "",
        images: [],
        contact: ""
      },
      feedbackTypes: ["功能建议", "BUG反馈", "界面问题", "其他问题"]
    };
  },
  methods: {
    onTypeChange(e) {
      this.form.type = this.feedbackTypes[e.detail.value];
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 3 - this.form.images.length,
        success: (res) => {
          this.form.images = [...this.form.images, ...res.tempFilePaths];
        }
      });
    },
    deleteImage(index) {
      this.form.images.splice(index, 1);
    },
    handleSubmit() {
      if (!this.form.type) {
        common_vendor.index.showToast({ title: "请选择反馈类型", icon: "none" });
        return;
      }
      if (!this.form.content) {
        common_vendor.index.showToast({ title: "请输入问题描述", icon: "none" });
        return;
      }
      common_vendor.index.showToast({
        title: "提交成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.form.type || "请选择反馈类型"),
    b: !$data.form.type ? 1 : "",
    c: common_vendor.p({
      type: "arrowright",
      size: "16",
      color: "#999"
    }),
    d: $data.feedbackTypes,
    e: common_vendor.o((...args) => $options.onTypeChange && $options.onTypeChange(...args)),
    f: $data.form.content,
    g: common_vendor.o(($event) => $data.form.content = $event.detail.value),
    h: common_vendor.t($data.form.content.length),
    i: common_vendor.f($data.form.images, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    j: $data.form.images.length < 3
  }, $data.form.images.length < 3 ? {
    k: common_vendor.p({
      type: "plus",
      size: "40",
      color: "#999"
    }),
    l: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    m: $data.form.contact,
    n: common_vendor.o(($event) => $data.form.contact = $event.detail.value),
    o: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-2aa7bac2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/feedback/index.js.map
