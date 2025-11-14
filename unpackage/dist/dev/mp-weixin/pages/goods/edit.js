"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_mockData = require("../../utils/mockData.js");
const _sfc_main = {
  data() {
    return {
      goodsId: "",
      form: {
        title: "",
        images: [],
        price: "",
        description: ""
      }
    };
  },
  onLoad(options) {
    if (options.id) {
      this.goodsId = options.id;
      this.loadGoods();
    }
  },
  methods: {
    loadGoods() {
      const goods = utils_mockData.getGoodsDetail(this.goodsId);
      if (goods) {
        this.form = {
          title: goods.title,
          images: [...goods.images],
          price: goods.price.toString(),
          description: goods.description
        };
      }
    },
    chooseImage() {
      common_vendor.index.chooseImage({
        count: 9 - this.form.images.length,
        success: (res) => {
          this.form.images = [...this.form.images, ...res.tempFilePaths];
        }
      });
    },
    deleteImage(index) {
      this.form.images.splice(index, 1);
    },
    handleSubmit() {
      common_vendor.index.showToast({
        title: "修改成功",
        icon: "success"
      });
      setTimeout(() => {
        common_vendor.index.navigateBack();
      }, 1500);
    },
    handleDelete() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要删除此商品吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.showToast({
              title: "删除成功",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.navigateBack();
            }, 1500);
          }
        }
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $data.form.title,
    b: common_vendor.o(($event) => $data.form.title = $event.detail.value),
    c: common_vendor.f($data.form.images, (img, index, i0) => {
      return {
        a: img,
        b: common_vendor.o(($event) => $options.deleteImage(index), index),
        c: index
      };
    }),
    d: $data.form.images.length < 9
  }, $data.form.images.length < 9 ? {
    e: common_vendor.p({
      type: "plus",
      size: "40",
      color: "#999"
    }),
    f: common_vendor.o((...args) => $options.chooseImage && $options.chooseImage(...args))
  } : {}, {
    g: $data.form.price,
    h: common_vendor.o(($event) => $data.form.price = $event.detail.value),
    i: $data.form.description,
    j: common_vendor.o(($event) => $data.form.description = $event.detail.value),
    k: common_vendor.o((...args) => $options.handleSubmit && $options.handleSubmit(...args)),
    l: common_vendor.o((...args) => $options.handleDelete && $options.handleDelete(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-df33928b"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/goods/edit.js.map
