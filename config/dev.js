const path = require("path");

const variable = "variable";

module.exports = {
  env: {
    NODE_ENV: '"development"'
  },
  alias: {
    "@/component": path.resolve(__dirname, "../src/component")
  },
  defineConstants: {
    testVariable: "'test-variable'",
    variable: "'variable'"
  },
  mini: {},
  h5: {
    esnextModules: ["taro-ui"]
  }
};
