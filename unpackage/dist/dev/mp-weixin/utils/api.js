"use strict";
const common_vendor = require("../common/vendor.js");
const utils_config = require("./config.js");
function request(options) {
  return new Promise((resolve, reject) => {
    {
      common_vendor.index.showLoading({
        title: "加载中...",
        mask: true
      });
    }
    const token = common_vendor.index.getStorageSync("token") || "";
    common_vendor.index.request({
      url: utils_config.config.baseURL + options.url,
      method: options.method || "GET",
      data: options.data || {},
      header: {
        "Content-Type": "application/json",
        "Authorization": token ? `Bearer ${token}` : "",
        ...options.header
      },
      timeout: utils_config.config.timeout,
      success: (res) => {
        {
          common_vendor.index.hideLoading();
        }
        if (res.statusCode === 200) {
          const response = res.data;
          if (response.code === 200) {
            resolve(response.data);
          } else if (response.code === 401) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("userId");
            common_vendor.index.removeStorageSync("token");
            common_vendor.index.showToast({
              title: "登录已过期，请重新登录",
              icon: "none"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/user/login"
              });
            }, 1500);
            reject(new Error("登录已过期"));
          } else {
            {
              common_vendor.index.showToast({
                title: response.message || "请求失败",
                icon: "none"
              });
            }
            reject(new Error(response.message || "请求失败"));
          }
        } else {
          {
            common_vendor.index.showToast({
              title: "网络错误",
              icon: "none"
            });
          }
          reject(new Error("网络错误"));
        }
      },
      fail: (err) => {
        {
          common_vendor.index.hideLoading();
        }
        {
          common_vendor.index.showToast({
            title: "网络连接失败",
            icon: "none"
          });
        }
        reject(err);
      }
    });
  });
}
function get(url, params = {}) {
  let queryString = "";
  if (Object.keys(params).length > 0) {
    queryString = "?" + Object.keys(params).map((key) => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`).join("&");
  }
  return request({
    url: url + queryString,
    method: "GET"
  });
}
function post(url, data = {}) {
  return request({
    url,
    method: "POST",
    data
  });
}
function put(url, data = {}) {
  return request({
    url,
    method: "PUT",
    data
  });
}
function del(url) {
  return request({
    url,
    method: "DELETE"
  });
}
exports.del = del;
exports.get = get;
exports.post = post;
exports.put = put;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/api.js.map
