"use strict";
const common_vendor = require("../common/vendor.js");
function isLoggedIn() {
  const token = common_vendor.index.getStorageSync("token");
  const userInfo = common_vendor.index.getStorageSync("userInfo");
  return !!(token && userInfo);
}
function getCurrentUser() {
  return common_vendor.index.getStorageSync("userInfo") || null;
}
function getCurrentUserId() {
  const userInfo = getCurrentUser();
  return userInfo ? userInfo.id : null;
}
function saveUserInfo(userInfo, token) {
  if (userInfo) {
    common_vendor.index.setStorageSync("userInfo", userInfo);
    if (userInfo.id) {
      common_vendor.index.setStorageSync("userId", userInfo.id);
    }
  }
  if (token) {
    common_vendor.index.setStorageSync("token", token);
  }
}
function clearUserInfo() {
  common_vendor.index.removeStorageSync("userInfo");
  common_vendor.index.removeStorageSync("userId");
  common_vendor.index.removeStorageSync("token");
}
function checkLogin() {
  if (!isLoggedIn()) {
    common_vendor.index.showToast({
      title: "请先登录",
      icon: "none"
    });
    setTimeout(() => {
      common_vendor.index.navigateTo({
        url: "/pages/user/login"
      });
    }, 1500);
    return false;
  }
  return true;
}
function logout() {
  return new Promise((resolve) => {
    common_vendor.index.showModal({
      title: "提示",
      content: "确定要退出登录吗？",
      success: (res) => {
        if (res.confirm) {
          clearUserInfo();
          common_vendor.index.showToast({
            title: "已退出登录",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/user/login"
            });
            resolve();
          }, 1500);
        } else {
          resolve();
        }
      }
    });
  });
}
exports.checkLogin = checkLogin;
exports.getCurrentUser = getCurrentUser;
exports.getCurrentUserId = getCurrentUserId;
exports.isLoggedIn = isLoggedIn;
exports.logout = logout;
exports.saveUserInfo = saveUserInfo;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/auth.js.map
