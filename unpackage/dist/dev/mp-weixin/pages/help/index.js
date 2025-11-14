"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      helpList: [
        {
          title: "如何发布商品？",
          content: '点击底部"发布"按钮，填写商品信息（标题、分类、图片、价格、描述等），点击"发布商品"即可。',
          expanded: false
        },
        {
          title: "如何购买商品？",
          content: '在商品详情页点击"立即购买"，确认订单信息后完成支付即可。',
          expanded: false
        },
        {
          title: "如何联系卖家？",
          content: '在商品详情页点击"联系卖家"，或进入"消息"页面找到对应的聊天记录，即可与卖家沟通。',
          expanded: false
        },
        {
          title: "如何申请退款？",
          content: '在订单详情页点击"申请退款"，填写退款原因，等待卖家处理。如遇问题可联系客服。',
          expanded: false
        },
        {
          title: "如何修改个人信息？",
          content: '进入"我的"页面，点击头像或右上角箭头，进入"编辑资料"页面修改信息。',
          expanded: false
        },
        {
          title: "如何管理收货地址？",
          content: '进入"我的"页面，点击"地址管理"，可以添加、编辑或删除收货地址。',
          expanded: false
        },
        {
          title: "交易安全保障",
          content: "平台提供交易担保服务，支持退款退货，确保交易安全。如有问题可随时联系客服。",
          expanded: false
        },
        {
          title: "如何举报违规商品？",
          content: '在商品详情页点击右上角"..."按钮，选择"举报"，填写举报原因提交即可。',
          expanded: false
        }
      ]
    };
  },
  methods: {
    toggleHelp(index) {
      this.helpList[index].expanded = !this.helpList[index].expanded;
    },
    contactService() {
      common_vendor.index.showModal({
        title: "联系客服",
        content: "客服电话：400-888-8888\n客服时间：9:00-18:00",
        showCancel: false,
        confirmText: "知道了"
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.helpList, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.title),
        b: "e6af2099-0-" + i0,
        c: common_vendor.p({
          type: item.expanded ? "arrowup" : "arrowdown",
          size: "16",
          color: "#999"
        }),
        d: item.expanded
      }, item.expanded ? {
        e: common_vendor.t(item.content)
      } : {}, {
        f: index,
        g: common_vendor.o(($event) => $options.toggleHelp(index), index)
      });
    }),
    b: common_vendor.o((...args) => $options.contactService && $options.contactService(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e6af2099"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/help/index.js.map
