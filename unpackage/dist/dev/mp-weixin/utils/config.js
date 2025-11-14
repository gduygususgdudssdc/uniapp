"use strict";
const common_vendor = require("../common/vendor.js");
const utils_api_config = require("./api.config.js");
const getBaseURL = () => {
  const storedURL = common_vendor.index.getStorageSync("apiBaseURL");
  if (storedURL) {
    return storedURL;
  }
  return utils_api_config.API_BASE_URL;
};
const config = {
  // API 基础地址（支持环境变量和动态配置）
  get baseURL() {
    return getBaseURL();
  },
  // 设置 API 基础地址（用于临时覆盖环境配置）
  setBaseURL(url) {
    common_vendor.index.setStorageSync("apiBaseURL", url);
    common_vendor.index.__f__("log", "at utils/config.js:26", "API 地址已更新为:", url);
  },
  // 清除自定义 API 地址（恢复默认配置）
  clearBaseURL() {
    common_vendor.index.removeStorageSync("apiBaseURL");
    common_vendor.index.__f__("log", "at utils/config.js:32", "API 地址已恢复为默认配置:", utils_api_config.API_BASE_URL);
  },
  // 请求超时时间（毫秒）
  get timeout() {
    return utils_api_config.API_TIMEOUT;
  },
  // 是否显示加载提示
  get showLoading() {
    return utils_api_config.SHOW_LOADING;
  },
  // 是否显示错误提示
  get showError() {
    return utils_api_config.SHOW_ERROR;
  }
};
exports.config = config;
//# sourceMappingURL=../../.sourcemap/mp-weixin/utils/config.js.map
