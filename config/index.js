const config = {
  // 项目名称
  projectName: "my-app-test",
  // 项目创建日期
  date: "2021-6-23",
  // 设计稿尺寸
  designWidth: 750,
  // 设计稿尺寸计算规则
  deviceRatio: {
    640: 2.34 / 2,
    750: 1,
    828: 1.81 / 2
  },
  // 项目源码目录
  sourceRoot: "src",
  // 项目产出目录
  outputRoot: "dist",
  // Taro 插件配置
  plugins: [],
  // 全局变量配置
  defineConstants: {},
  // 文件 copy 配置
  copy: {
    patterns: [],
    options: {}
  },
  // 框架，react，nerv，vue，vue3等
  framework: "react",
  // 小程序专用配置
  mini: {
    postcss: {
      pxtransform: {
        enable: true,
        config: {}
      },
      // 小程序端样式引用本地资源内联配置
      url: {
        enable: true,
        config: {
          limit: 1024 // 设定转换尺寸上限
        }
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {}
  },
  // H5 端专用配置
  h5: {
    publicPath: "/",
    staticDirectory: "static",
    postcss: {
      autoprefixer: {
        enable: true,
        config: {}
      },
      cssModules: {
        enable: false, // 默认为 false，如需使用 css modules 功能，则设为 true
        config: {
          namingPattern: "module", // 转换模式，取值为 global/module
          generateScopedName: "[name]__[local]___[hash:base64:5]"
        }
      }
    },
    // 自定义 Webpack 配置
    webpackChain(chain, webpack) {},
    devServer: {}
  }
};

module.exports = function(merge) {
  if (process.env.NODE_ENV === "development") {
    return merge({}, config, require("./dev"));
  }
  return merge({}, config, require("./prod"));
};
