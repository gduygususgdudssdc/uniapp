"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_apiService = require("../../utils/apiService.js");
const utils_auth = require("../../utils/auth.js");
const _sfc_main = {
  __name: "updata",
  setup(__props) {
    const form = common_vendor.ref({
      id: null,
      username: "",
      avatar: "",
      email: "",
      address: ""
    });
    const saving = common_vendor.ref(false);
    common_vendor.onLoad(() => {
      if (!utils_auth.checkLogin()) {
        common_vendor.index.navigateBack();
        return;
      }
      const currentUser = utils_auth.getCurrentUser();
      if (currentUser) {
        form.value = {
          id: currentUser.id,
          username: currentUser.username || "",
          avatar: currentUser.avatar || "",
          email: currentUser.email || "",
          address: currentUser.address || ""
        };
      }
    });
    function chooseAvatar() {
      common_vendor.index.chooseImage({
        count: 1,
        sizeType: ["compressed"],
        sourceType: ["album", "camera"],
        success: (res) => {
          const tempFilePath = res.tempFilePaths[0];
          form.value.avatar = tempFilePath;
          uploadAvatar(tempFilePath);
        },
        fail: (err) => {
          common_vendor.index.__f__("error", "at pages/user/updata.vue:95", "选择图片失败:", err);
          common_vendor.index.showToast({ title: "选择图片失败", icon: "none" });
        }
      });
    }
    async function uploadAvatar(filePath) {
      try {
        common_vendor.index.showLoading({ title: "上传中..." });
        const userId = utils_auth.getCurrentUserId();
        if (!userId) {
          common_vendor.index.hideLoading();
          common_vendor.index.showToast({ title: "用户信息错误", icon: "none" });
          return;
        }
        const avatarUrl = filePath;
        await utils_apiService.userApi.updateAvatar(userId, avatarUrl);
        form.value.avatar = avatarUrl;
        const updatedUser = await utils_apiService.userApi.getUserInfo(userId);
        if (updatedUser) {
          utils_auth.saveUserInfo(updatedUser, common_vendor.index.getStorageSync("token"));
        }
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({ title: "头像上传成功", icon: "success" });
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/updata.vue:137", "上传头像失败:", error);
        common_vendor.index.hideLoading();
        common_vendor.index.showToast({
          title: error.message || "上传头像失败",
          icon: "none"
        });
      }
    }
    async function handleSave() {
      if (!form.value.username || form.value.username.trim() === "") {
        common_vendor.index.showToast({ title: "请输入昵称", icon: "none" });
        return;
      }
      if (saving.value) {
        return;
      }
      saving.value = true;
      try {
        const userId = utils_auth.getCurrentUserId();
        if (!userId) {
          common_vendor.index.showToast({ title: "用户信息错误", icon: "none" });
          return;
        }
        const currentUser = utils_auth.getCurrentUser();
        if (form.value.username !== (currentUser == null ? void 0 : currentUser.username)) {
          await utils_apiService.userApi.updateUsername(userId, form.value.username);
        }
        if (form.value.email !== (currentUser == null ? void 0 : currentUser.email) || form.value.address !== (currentUser == null ? void 0 : currentUser.address)) {
          await utils_apiService.userApi.updateUser(userId, {
            email: form.value.email || "",
            address: form.value.address || ""
          });
        }
        const updatedUser = await utils_apiService.userApi.getUserInfo(userId);
        if (updatedUser) {
          utils_auth.saveUserInfo(updatedUser, common_vendor.index.getStorageSync("token"));
        }
        common_vendor.index.showToast({ title: "保存成功", icon: "success" });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/user/updata.vue:196", "保存失败:", error);
        common_vendor.index.showToast({
          title: error.message || "保存失败，请重试",
          icon: "none",
          duration: 2e3
        });
      } finally {
        saving.value = false;
      }
    }
    return (_ctx, _cache) => {
      return {
        a: form.value.avatar || "/static/default-avatar.png",
        b: common_vendor.o(chooseAvatar),
        c: form.value.username,
        d: common_vendor.o(($event) => form.value.username = $event.detail.value),
        e: form.value.email,
        f: common_vendor.o(($event) => form.value.email = $event.detail.value),
        g: form.value.address,
        h: common_vendor.o(($event) => form.value.address = $event.detail.value),
        i: common_vendor.t(saving.value ? "保存中..." : "保存"),
        j: common_vendor.o(handleSave),
        k: saving.value
      };
    };
  }
};
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["__scopeId", "data-v-459e1402"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/user/updata.js.map
