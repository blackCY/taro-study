// 导出全局配置
// 配置规范基于微信小程序的[全局配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/app.html)进行制定，所以平台进行统一：
export default {
  pages: ["pages/index/index"],
  window: {
    backgroundTextStyle: "light",
    navigationBarBackgroundColor: "#fff",
    navigationBarTitleText: "WeChat",
    navigationBarTextStyle: "black"
  }
};

// 注意：
//    1. app.config.js 里 require 或 import 引用的 js 文件目前没有经过 Babel 编译语法
//    2. 多端差异化逻辑可以使用 process.env.TARO_ENV 变量作条件判断以实现
