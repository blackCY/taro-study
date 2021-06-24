# 进阶指南

## 插件功能

Taro 引入了插件化机制，目的是为了让开发者能够通过编写插件的方式来为 Taro 拓展更多功能或为自身业务定制个性化功能。

### 官方插件

Taro 提供了一些官方插件

- [@tarojs/plugin-mock](https://github.com/NervJS/taro-plugin-mock)，一个简易的数据 mock 插件

### 如何引入插件

你可以从 npm 或者本地中引入插件，引入方式主要通过[编译配置](https://taro-docs.jd.com/taro/docs/config-detail)中的 plugins 和 presets，使用如下：

#### plugins

插件在 Taro 中，一般通过[编译配置](https://taro-docs.jd.com/taro/docs/config-detail)中的 plugins 字段进行引入。

plugins 字段取值为一个数组，配置方式如下：

```js
const config = {
  plugins: [
    // 引入 npm 安装的插件
    "@tarojs/plugin-mock",
    // 引入 npm 安装的插件，并传入插件参数
    [
      "@tarojs/plugin-mock",
      {
        mocks: {
          "/api/user/1": {
            name: "judy",
            desc: "Mental guy"
          }
        }
      }
    ],
    // 从本地绝对路径引入插件，同样如果需要传入参数也是如上
    "/absulute/path/plugin/filename"
  ]
};
```

#### presets

如果你有一系列插件需要配置，而他们通常是组合起来完成特定的事儿，那你可以通过插件集 presets 来进行配置。

配置[编译配置](https://taro-docs.jd.com/taro/docs/config-detail)中的 presets 字段，如下。

```js
const config = {
  presets: [
    // 引入 npm 安装的插件集
    "@tarojs/preset-sth",
    // 引入 npm 安装的插件集，并传入插件参数
    [
      "@tarojs/plugin-sth",
      {
        arg0: "xxx"
      }
    ],
    // 从本地绝对路径引入插件集，同样如果需要传入参数也是如上
    "/absulute/path/preset/filename"
  ]
};
```

在了解完如何引入插件之后，我们来学习一下如何编写一个插件。

### 如何编写一个插件

一个 Taro 的插件都具有固定的代码结构，通常由一个函数组成，示例如下：

```js
export default (ctx, options) => {
  // plugin 主体
  ctx.onBuildStart(() => {
    console.log("编译开始！");
  });
  ctx.onBuildFinish(() => {
    console.log("编译结束！");
  });
};
```

插件函数可以接受两个参数：

- ctx：插件当前的运行环境信息，包含插件相关的 API、当前运行参数、辅助方法等等。
- options：为插件调用时传入的参数

在插件主体代码部分可以按照自己的需求编写相应代码，通常你可以实现以下功能。

#### Typings

建议使用 typescript 来编写插件，这样你就会获得很棒的智能提示，使用方式如下：

```tsx
import { IPluginContext } from "@tarojs/service";
export default (ctx: IPluginContext, pluginOpts) => {
  // 接下来使用 ctx 的时候就能获得智能提示了
  ctx.onBuildStart(() => {
    console.log("编译开始！");
  });
};
```

#### 主要功能

##### 命令行扩展

你可以通过编写插件来为 Taro 拓展命令行的命令，在之前版本的 Taro 中，命令行的命令是固定的，如果你要进行扩展，那你得直接修改 Taro 源码，而如今借助插件功能，你可以任意拓展 Taro 的命令行。

这个功能主要通过 ctx.registerCommand API 来进行实现，例如，增加一个上传的命令，将编译后的代码上传到服务器：

```js
export default ctx => {
  ctx.registerCommand({
    // 命令名
    name: "upload",
    // 执行 taro upload --help 时输出的 options 信息
    optionsMap: {
      "--remote": "服务器地址"
    },
    // 执行 taro upload --help 时输出的使用例子的信息
    synopsisList: ["taro upload --remote xxx.xxx.xxx.xxx"],
    async fn() {
      const { remote } = ctx.runOpts;
      await uploadDist();
    }
  });
};
```

将这个插件配置到中项目之后，就可以通过 `taro upload --remote xxx.xxx.xxx.xxx` 命令将编译后代码上传到目标服务器。

##### 编译过程扩展

同时你也可以通过插件对代码编译过程进行拓展。

正如前面所述，针对编译过程，有 onBuildStart、onBuildFinish 两个钩子来分别表示编译开始，编译结束，而除此之外也有更多 API 来对编译过程进行修改，如下：

- `ctx.onBuildStart(() => void)`，编译开始，接收一个回调函数
- `ctx.modifyWebpackChain(args: { chain: any }) => void)`，编译中修改 webpack 配置，在这个钩子中，你可以对 webpackChain 作出想要的调整，等同于配置 [webpackChain](https://taro-docs.jd.com/taro/docs/config-detail#miniwebpackchain)
- `ctx.modifyBuildAssets(args: { assets: any }) => void)`，修改编译后的结果
- `ctx.modifyBuildTempFileContent(args: { tempFiles: any }) => void)`，修改编译过程中的中间文件，例如修改 app 或页面的 config 配置
- `ctx.onBuildFinish(() => void)`，编译结束，接收一个回调函数

##### 编译平台拓展

你也可以通过插件功能对编译平台进行拓展。

使用 API ctx.registerPlatform，Taro 中内置的平台支持都是通过这个 API 来进行实现。

> 注意：这是未完工的功能，需要依赖代码编译器 `@tarojs/transform-wx` 的改造完成

通过以上内容，我们已经大致知道 Taro 插件可以实现哪些特性并且可以编写一个简单的 Taro 插件了，但是，为了能够编写更加复杂且标准的插件，我们需要了解 Taro 插件机制中的具体 API 用法。

#### 插件环境变量

[详见](https://taro-docs.jd.com/taro/docs/plugin#%E6%8F%92%E4%BB%B6%E7%8E%AF%E5%A2%83%E5%8F%98%E9%87%8F)

#### 插件方法

[详见](https://taro-docs.jd.com/taro/docs/plugin#%E6%8F%92%E4%BB%B6%E6%96%B9%E6%B3%95)

## 单步调测配置

> 通过本身 VSCode 提供的跨平台代码单步调测能力，能够极大提升基于 Taro 开发框架的应用开发速度，因其他平台已有比较成熟的工具可以使用，着重降低 Windows 平台配置复杂度。

### 一、开发环境搭建

首先准备 Taro 在 Windows 下的基础开发环境，详情如下(已有开发环境可略过）：

1. Taro 源码下载

下载地址：[Taro](https://github.com/NervJS/taro.git)，默认为 2.x 分支，若要调试 Taro Next，请先撤换到 next 分支。

2. 全局安装 Node-sass 、Lerna 和 Rollup

```js
npm i -g node-sass --sass_binary_site=https://npm.taobao.org/mirrors/node_sass/
yarn global add lerna
yarn global add rollup
```

> Node-sass 比较特殊，建议提前进行安装，规避可能出现的各种异常错误。

3. 源码依赖安装

- 1. 使用 VSCode 打开 Taro 源码目录，在根目录下执行 yarn ，安装项目所需依赖库（首次安装所花时间较长，请耐心等待）
- 2. 待 yarn 执行完毕后，执行 yarn run bootstrap 为子包安装依赖
- 3. 执行 yarn build 编译所有模块

### 调试 CLI

1. 配置 VSCode 调试参数

在 VSCode 中打开 Taro 源码根目录的 .vscode 文件夹，编辑 launch.json。

launch.json 有以下预设配置：

```json
{
  // ...
  "configurations": [
    //...
    {
      "type": "node",
      "request": "launch",
      "name": "CLI debug",
      "program": "${workspaceFolder}/packages/taro-cli/bin/taro",
      // "cwd": "${project absolute path}",
      // "args": [
      //   "build",
      //   "--type",
      //   "weapp",
      //   "--watch"
      // ],
      "skipFiles": ["<node_internals>/**"]
    }
  ]
}
```

修改步骤：

- 1. 修改 cwd 选项为需要调试的目标工作目录
- 2. 修改 args 为需要调试的命令参数

> launch.json 的详细配置请见 [VSCode 文档](https://code.visualstudio.com/docs/editor/debugging#_launch-configurations)

例子：

[调试 taro-build#](https://taro-docs.jd.com/taro/docs/debug-config#%E8%B0%83%E8%AF%95-taro-build)

## 渲染 HTML

请注意：本章节所有内容只在小程序端起效果。

Taro 可以直接通过 `Element#innerHTML` 或 Vue 的 `v-html` 或 React/Nerv 的 `dangerouslySetInnerHTML` 直接渲染 HTML:

- React

```jsx
function helloWorld() {
  const html = `<h1 style="color: red">Wallace is way taller than other reporters.</h1>`;

  return <View dangerouslySetInnerHTML={{ __html: html }}></View>;
}
```

- Vue

```vue
<template>
  <view v-html="html"></view>
</template>

<script>
export default {
  data() {
    return {
      html: `<h1 style="color: red">Wallace is way taller than other reporters.</h1>`
    };
  }
};
</script>
```
