# Taro 基础知识

## 入口组件

### onLaunch(options)

> 在小程序环境中对应 app 的 onLaunch

在此生命周期中通过访问 options 参数或调用 getCurrentInstance().router，可以访问到程序初始化参数 uniapp

#### options

[详见](https://taro-docs.jd.com/taro/docs/react#%E5%8F%82%E6%95%B0)

### componentDidShow(options)

程序启动，或切前台时触发

和 onLaunch 生命周期一样，在此生命周期中通过访问 options 参数或调用 getCurrentInstance().router，可以访问到程序初始化参数

参数与 onLaunch 中获取的基本一致，但百度小程序中补充两个参数如下：

| 属性      | 类型   | 说明                                                                                                                            |
| :-------- | ------ | ------------------------------------------------------------------------------------------------------------------------------- |
| entryType | string | 展现的来源标识，取值为 user/ schema /sys : user：表示通过 home 前后切换或解锁屏幕等方式调起；schema：表示通过协议调起;sys：其它 |
| appURL    | string | 展现时的调起协议，仅当 entryType 值为 schema 时存在                                                                             |

### componentDidHide()

程序切后台时触发

### onPageNotFound(Object)

程序要打开的页面不存在时触发

#### 参数

[详见](https://taro-docs.jd.com/taro/docs/react#%E5%8F%82%E6%95%B0-1)

## 页面组件

每一个 Taro 应用都至少包括一个页面组件，页面组件可以通过 Taro 进行路由跳转，也可以访问小程序页面的生命周期。

```jsx
import React, { Component } from "react";
import { View } from "@tarojs/components";

class Index extends Component {
  // 可以使用所有的 React 组件方法
  componentDidMount() {}

  // onLoad
  onLoad() {}

  // onReady
  onReady() {}

  // 对应 onShow
  componentDidShow() {}

  // 对应 onHide
  componentDidHide() {}

  // 对应 onPullDownRefresh，除了 componentDidShow/componentDidHide 之外，
  // 所有页面生命周期函数名都与小程序相对应
  onPullDownRefresh() {}

  render() {
    return <View className="index" />;
  }
}

export default Index;
```

```jsx
import React, { useEffect } from "react";
import { View } from "@tarojs/components";
import {
  useReady,
  useDidShow,
  useDidHide,
  usePullDownRefresh
} from "@tarojs/taro";

function Index() {
  // 可以使用所有的 React Hooks
  useEffect(() => {});

  // 对应 onReady
  useReady(() => {});

  // 对应 onShow
  useDidShow(() => {});

  // 对应 onHide
  useDidHide(() => {});

  // Taro 对所有小程序页面生命周期都实现了对应的自定义 React Hooks 进行支持
  // 详情可查阅：【Taro 文档】-> 【进阶指南】->【Hooks】
  usePullDownRefresh(() => {});

  return <View className="index" />;
}

export default Index;
```

### 页面配置

对应每一个页面组件（例如`./pages/index/index.jsx`），我们可以新增一个`./pages/index/index.config.js`的文件进行页面配置，`index.config.js`的默认导出就是页面配置

配置规范基于微信小程序的[页面配置](https://developers.weixin.qq.com/miniprogram/dev/reference/configuration/page.html)进行制定，所有平台进行统一：

```js
export default {
  navigationBarTitleText: "首页"
};
```

注意：

1. app.config.js 里 require 或 import 引用的 js 文件目前没有经过 Babel 编译语法。
2. 多端差异化逻辑可以使用 process.env.TARO_ENV 变量作条件判断以实现。

### 路由参数

在页面组件中，可以通过 getCurrentInstance().router 获取当前页面的路由参数：

```jsx
import React, { Component } from "react";
import { View } from "@tarojs/components";
import { getCurrentInstance } from "@tarojs/taro";

class Index extends Component {
  // 建议在页面初始化时把 getCurrentInstance() 的结果保存下来供后面使用，
  // 而不是频繁地调用此 API
  $instance = getCurrentInstance();

  componentDidMount() {
    // 获取路由参数
    console.log($instance.router);
  }

  render() {
    return <View className="index" />;
  }
}

export default Index;
```

### 生命周期触发机制

Taro3 在小程序逻辑层上实现了一份遵循 Web 标准 BOM 和 DOM API。因此 React 使用的 document.appentChild、document.removeChild 等 API 其实是 Taro 模拟实现的，最终的效果是把 React 的虚拟 DOM 树渲染为 Taro 模拟的 Web 标准 DOM 树

因此在 Taro3 中，React 的生命周期触发时机和我们平常在 Web 开发中理解的概念有一些偏差。

#### React 的生命周期

React 组件的生命周期方法在 Taro 中都支持使用。

触发时机：

1. componentWillMount()

[onLoad](https://taro-docs.jd.com/taro/docs/react#onload-options) 之后，页面组件渲染到 Taro 的虚拟 DOM 之前触发。

2. componentDidMount()

页面组件渲染到 Taro 的虚拟 DOM 之后触发。

此时能访问到 Taro 的虚拟 DOM（使用 React ref、document.getElementById 等手段），并支持对其进行操作（设置 DOM 的 style 等）。

但此时不代表 Taro 的虚拟 DOM 数据已经完成从逻辑层 setData 到视图层。因此这时无法通过 createSelectorQuery 等方法获取小程序渲染层 DOM 节点。 只能在 [onReady](https://taro-docs.jd.com/taro/docs/react#onready-) 生命周期中获取。

#### 小程序页面的方法

小程序页面的方法，在 Taro 的页面中同样可以使用：在 Class Component 中书写同名方法、在 Functional Component 中使用对应的 Hooks。

注意：

- 小程序页面方法在各端的支持程度不一。
- 使用了 HOC 包裹的小程序页面组件，必须处理 forwardRef 或使用继承组件的方式而不是返回组件的方式，否则小程序页面方法可能不会被触发。

### onLoad(options)

> 在小程序环境中对应页面的 onLoad。

在此生命周期中通过访问 options 参数或调用 getCurrentInstance().router，可以访问到页面路由参数。

### onReady()

> 在小程序环境中对应页面的 onReady。

从此生命周期开始可以使用 createCanvasContext 或 createSelectorQuery 等 API 访问小程序渲染层的 DOM 节点。

#### 子组件的 onReady

只有页面组件才会触发 onReady 生命周期。子组件可以使用 Taro 内置的[消息机制](https://taro-docs.jd.com/taro/docs/apis/about/events)监听页面组件的 onReady() 生命周期：

```jsx
import React from "react";
import { View } from "@tarojs/components";
import Taro, { eventCenter, getCurrentInstance } from "@tarojs/taro";

class Test extends React.Component {
  $instance = getCurrentInstance();

  componentWillMount() {
    const onReadyEventId = this.$instance.router.onReady;
    eventCenter.once(onReadyEventId, () => {
      console.log("onReady");

      // onReady 触发后才能获取小程序渲染层的节点
      Taro.createSelectorQuery()
        .select("#only")
        .boundingClientRect()
        .exec(res => console.log(res, "res"));
    });
  }

  render() {
    return <View id="only"></View>;
  }
}
```

**但是当子组件是按需加载的时候，页面 onReady 早已触发。如果此按需加载的子组件需要获取小程序渲染层的 DOM 节点，因为错过了页面的 onReady，职民工尝试使用 Taro.nextTick 模拟：**

```jsx
import React from "react";
import { View } from "@tarojs/components";
import Taro from "@tarojs/taro";

class Test extends React.Component {
  componentDidMount() {
    Taro.nextTick(() => {
      // 使用 Taro.nextTick 模拟 setData 已结束，节点已完成渲染
      Taro.createSelectorQuery()
        .select("#only")
        .boundingClientRect()
        .exec(res => console.log(res, "res"));
    });
  }

  render() {
    return <View id="only" />;
  }
}
```

### componentDidShow()

> 在小程序环境中对应页面的 onShow。

页面显示/切入前台时触发

#### 子组件的 onShow

只在页面组件才会触发 onShow 生命周期。子组件可以使用 Taro 内置的[消息机制](https://taro-docs.jd.com/taro/docs/apis/about/events)监听页面组件的 onShow() 生命周期：

```jsx
import React from "react";
import { View } from "@tarojs/components";
import { eventCenter, getCurrentInstance } from "@tarojs/taro";

class Test extends React.Component {
  $instance = getCurrentInstance();

  componentWillMount() {
    const onShowEventId = this.$instance.router.onShow;
    // 监听
    eventCenter.on(onShowEventId, this.onShow);
  }

  componentWillUnmount() {
    const onShowEventId = this.$instance.router.onShow;
    // 卸载
    eventCenter.off(onShowEventId, this.onShow);
  }

  onShow = () => {
    console.log("onShow");
  };

  render() {
    return <View id="only" />;
  }
}
```

### componentDidHide()

> 在小程序环境中对应页面的 onHide

页面隐藏/切入后台时触发。

#### 子组件的 onHide

只有页面组件才会触发 onHide 生命周期。子组件可以使用 Taro 内置的[消息机制](https://taro-docs.jd.com/taro/docs/apis/about/events) 监听页面组件的 onHide 生命周期：

```jsx
import React from "react";
import { View } from "@tarojs/components";
import { eventCenter, getCurrentInstance } from "@tarojs/taro";

class Test extends React.Component {
  $instance = getCurrentInstance();

  componentWillMount() {
    const onHideEventId = this.$instance.router.onHide;
    // 监听
    eventCenter.on(onHideEventId, this.onHide);
  }

  componentWillUnmount() {
    const onHideEventId = this.$instance.router.onHide;
    // 卸载
    eventCenter.off(onHideEventId, this.onHide);
  }

  onHide = () => {
    console.log("onHide");
  };

  render() {
    return <View id="only" />;
  }
}
```

### onPullDownRefresh ()

监听用户下拉动作。

- 需要在全局配置的 window 选项中或页面配置中设置 enablePullDownRefresh: true。
- 可以通过 [Taro.startPullDownRefresh](https://taro-docs.jd.com/taro/docs/apis/ui/pull-down-refresh/startPullDownRefresh) 触发下拉刷新，调用后触发下拉刷新动画，效果与用户手动下拉刷新一致。
- 当处理完数据刷新后，[Taro.stopPullDownRefresh](https://taro-docs.jd.com/taro/docs/apis/ui/pull-down-refresh/stopPullDownRefresh) 可以停止当前页面的下拉刷新.

### onReachBottom ()

监听用户上拉触底事件。

- 可以在全局配置的 window 选项中或页面配置中设置触发距离 onReachBottomDistance。
- 在触发距离内滑动期间，本事件只会被触发一次

> H5 暂时没有同步实现，可以通过给 window 绑定 scroll 事件来进行模拟

### onPageScroll (Object)

监听用户滑动页面事件。

> H5 暂时没有同步实现，可以通过给 window 绑定 scroll 事件来进行模拟

#### 参数

| 参数      | 类型   | 说明                                  |
| :-------- | ------ | ------------------------------------- |
| scrollTop | Number | 页面在垂直方向已滚动的距离（单位 px） |

### onAddToFavorites (Object)

监听用户点击右上角菜单“收藏”按钮的行为，并自定义收藏内容。

> Taro 3.0.3 版本开始支持。 只有微信小程序支持，本接口为 Beta 版本，安卓 7.0.15 版本起支持，暂只在安卓平台支持。

#### 参数

| 参数       | 类型   | 说明                                                 |
| :--------- | ------ | ---------------------------------------------------- |
| webviewUrl | String | 页面中包含 web-view 组件时，返回当前 web-view 的 url |

此事件处理函数需要 return 一个 Object，用于自定义收藏内容：

| 字段     | 说明                              | 默认值             |
| :------- | --------------------------------- | ------------------ |
| title    | 自定义标题                        | 页面标题或账号名称 |
| imageUrl | 自定义图片，显示图片长宽比为 1：1 | 页面截图           |
| query    | 自定义 query 字段                 | 当前页面的 query   |

```jsx
onAddToFavorites (res) {
  // webview 页面返回 webviewUrl
  console.log('WebviewUrl: ', res.webviewUrl)
  return {
    title: '自定义标题',
    imageUrl: 'http://demo.png',
    query: 'name=xxx&age=xxx',
  }
}
```

### onShareAppMessage (Object)

监听用户点击页面内转发按钮（Button 组件 openType='share'）活右上角菜单“转发”按钮的行为，并自定义转发内容。

注意：

1. 当 onShareAppMessage 没有触发时，请在页面配置中设置 enableShareAppMessage: true
2. 只有定义了此事件处理函数，右上角菜单才会显示“转发”按钮

#### 参数

[详见](https://taro-docs.jd.com/taro/docs/react#%E5%8F%82%E6%95%B0-4)

此事件需要 return 一个 Object，用于自定义转发内容，返回内容如下：

自定义转发内容

| 字段     | 类型                                                                                                       | 说明                                      |
| :------- | ---------------------------------------------------------------------------------------------------------- | ----------------------------------------- |
| title    | 转发标题                                                                                                   | 当前小程序名称                            |
| path     | 转发路径                                                                                                   | 当前页面 path ，必须是以 / 开头的完整路径 |
| imageUrl | 自定义图片路径，可以是本地文件路径、代码包文件路径或者网络图片路径。支持 PNG 及 JPG 。显示图片长宽比是 5:4 | 使用默认截图                              |

```jsx
export default class Index extends Component {
  onShareAppMessage(res) {
    if (res.from === "button") {
      // 来自页面内转发按钮
      console.log(res.target);
    }
    return {
      title: "自定义转发标题",
      path: "/page/user?id=123"
    };
  }
}
```

```js
export default {
  // 当 `onShareAppMessage` 没有触发时，可以尝试配置此选项
  enableShareAppMessage: true
};
```

### onShareTimeline ()

监听右上角菜单“分享到朋友圈”按钮的行为，并自定义分享内容。

> Taro 3.0.3 版本开始支持 只有微信小程序支持，基础库 2.11.3 开始支持，本接口为 Beta 版本，暂只在 Android 平台支持

注意：

1. 当 onShareTimeline 没有触发时，请在页面配置中设置 enableShareTimeline: true
2. 只有定义了此事件处理函数，右上角菜单才会显示“分享到朋友圈”按钮

#### 返回值

事件处理函数可以返回一个 Object，用于自定义分享内容，不支持自定义页面路径，返回内容如下：

| 字段     | 说明                                                                                | 默认值                 |
| :------- | ----------------------------------------------------------------------------------- | ---------------------- |
| title    | 自定义标题                                                                          | 当前小程序名称         |
| query    | 自定义页面路径中携带的参数                                                          | 当前页面路径携带的参数 |
| imageUrl | 自定义图片路径，可以是本地文件或者网络图片。支持 PNG 及 JPG，显示图片长宽比是 1:1。 | 默认使用小程序 Logo    |

```jsx
class Index extends Component {
  onShareTimeline() {
    console.log("onShareTimeline");
    return {};
  }
}
```

```jsx
export default {
  // 当 `onShareAppMessage` 没有触发时，可以尝试配置此选项
  enableShareTimeline: true
};
```

### onResize (Object)

小程序屏幕旋转时触发。详见[响应显示区域变化](https://developers.weixin.qq.com/miniprogram/dev/framework/view/resizable.html#%E5%9C%A8%E6%89%8B%E6%9C%BA%E4%B8%8A%E5%90%AF%E7%94%A8%E5%B1%8F%E5%B9%95%E6%97%8B%E8%BD%AC%E6%94%AF%E6%8C%81)。

### onTabItemTap (Object)

点击 tab 时触发。

#### 参数

| 参数     | 类型   | 说明                             |
| :------- | ------ | -------------------------------- |
| index    | String | 被点击 tabItem 的序号，从 0 开始 |
| pagePath | String | 被点击 tabItem 的页面路径        |
| text     | String | 被点击 tabItem 的按钮文字        |

### onTitleClick ()

> 只有支付宝小程序支持

点击标题触发

### onOptionMenuClick ()

> 只有支付宝小程序支持

点击导航栏额外图标触发

### onPopMenuClick ()

> 只有支付宝小程序支持

暂无说明

### onPullIntercept ()

> 只有支付宝小程序支持

下拉截断时触发

## 内置组件

Taro 中使用小程序规范的内置组件进行开发，如 <View />、<Text />、<Button /> 等。

在 React 中使用这些内置组件前，必须从 @tarojs/components 进行引入，组件的 props 遵从大驼峰式命名规范：

小程序写法:

```html
<view hover-class="test" />
```

对应 Taro 的写法：

```jsx
import { View } from "@tarojs/components";

<View hoverClass="test" />;
```

## 事件

在 Taro 中事件遵从小驼峰式（camelCase）命名规范，所有内置事件名以 on 开头。

在事件回调函数中，第一个参数是事件本身，回调中调用 stopPropagation 可以阻止冒泡。

```jsx
function Comp() {
  function clickHandler(e) {
    e.stopPropagation(); // 阻止冒泡
  }

  function scrollHandler() {}

  // 只有小程序的 bindtap 对应 Taro 的 onClick
  // 其余小程序事件名把 bind 换成 on 即是 Taro 事件名（支付宝小程序除外，它的事件就是以 on 开头）
  return <ScrollView onClick={clickHandler} onScroll={scrollHandler} />;
}
```

### Taro 3 在小程序端的事件机制

在 Taro 1 & 2 中，Taro 会根据开发者是否使用了 e.stopPropagation()，来决定在小程序模板中绑定的事件是以 bind 还是以 catch 形式。因此事件冒泡是由小程序控制的。

但是在 Taro 3，我们在小程序逻辑层实现了一套事件系统，包括事件触发和事件冒泡。在小程序模板中绑定的事件都是以 bind 的形式。

一般情况下，这套在逻辑层实现的小程序事件系统是可以正常工作的，事件回调能正确触发、冒泡、停止冒泡。

但是，小程序模板中绑定的 catchtouchmove 事件除了可以阻止回调函数冒泡触发外，还能阻止视图的滚动穿透，这点 Taro 的事件系统是做不到的。

### 组织滚动穿透

上一点中，我们介绍了 Taro 3 的事件机制。因为事件都以 bind 的形式进行绑定，因此不能使用 e.stopPropagation() 阻止滚动穿透。

针对滚动穿透，目前总结了两种解决办法：

#### 一、样式

使用样式解决：[禁止被穿透的组件滚动](https://github.com/NervJS/taro/issues/5984#issuecomment-614502302)。

这也是最推荐的做法。

#### 二、catchMove

> Taro 3.0.21 版本开始支持

但是地图组件本身就是可以滚动的，即使固定了它的宽高。所以第一种办法处理不了冒泡到地图组件上的滚动事件。

这时候可以为 View 组件增加 catchMove 属性：

```jsx
// 这个 View 组件会绑定 catchtouchmove 事件而不是 bindtouchmove
<View catchMove></View>
```

## 全局变量

在使用 React 时，全局变量推荐使用 React Redux 等状态管理工具进行管理。

而有时候一些从原生小程序转换过来的项目，会把全局变量挂载到 app 上，然后使用 getApp() 获取它们。改造为 React 生态的状态管理方式成本比较大。

因此可以使用入口对象的 taroGlobalData 属性对这种写法进行兼容：

```jsx
class App extends Component {
  taroGlobalData = {
    x: 1
  };
  render() {
    return this.props.children;
  }
}
```

```jsx
function Index () {
  const app = Taro.getApp()
  console.log(app.x)

  return (...)
}
```

## Hooks

[Hooks 文档](https://taro-docs.jd.com/taro/docs/hooks)

## 其它限制

- 由于小程序不支持动态引入，因此小程序中无法使用 React.lazy API。
- 不能在页面组件的 DOM 树之外插入元素，因此不支持 <Portal>。
- 所有组件的 id 必须在整个应用中保持唯一（即使他们在不同的页面），否则可能导致事件不触发的问题，[#7317](https://github.com/NervJS/taro/issues/7317)

## 常见问题

useEffect、componentDidMount 中获取不到渲染层元素信息，[7116](https://github.com/NervJS/taro/issues/7116)
useEffect 或 useLayoutEffect 中获取不到组件最新的宽高，[#7491](https://github.com/NervJS/taro/issues/7491)
嵌套层级较深时，使用 selectorQuery 无法查询到子元素，[#7411](https://github.com/NervJS/taro/issues/7411)

## 路由功能

### 路由 API 说明

在 Taro 中，路由功能是默认自带的，不需要开发者进行额外的路由配置。

我们只需要在入口文件的 config 配置中指定好 pages，然后就可以在代码中通过 Taro 提供的 API 来跳转到目的页面，例如：

```jsx
// 跳转到目的页面，打开新页面
Taro.navigateTo({
  url: "/pages/page/path/name"
});

// 跳转到目的页面，在当前页面打开
Taro.redirectTo({
  url: "/pages/page/path/name"
});
```

具体 API 说明，请查看[导航](https://taro-docs.jd.com/taro/docs/apis/route/navigateTo)部分说明。

### 路由传参

我们可以通过在所有跳转的 url 后面添加查询字符串参数进行跳转传参，例如

```js
// 传入参数 id=2&type=test
Taro.navigateTo({
  url: "/pages/page/path/name?id=2&type=test"
});
```

这样的话，在跳转成功的目标页的生命周期方法里就能通过 getCurrentInstance().router.params 获取到传入的参数，例如上述跳转，在目标页的 componentWillMount（或 Vue 的 created） 生命周期里获取入参:

```jsx
import { getCurrentInstance } from "@tarojs/taro";
import React, { Component } from "react";

export default class C extends Component {
  componentDidMount() {
    console.log(getCurrentInstance().router.params); // 输出 { id: 2, type: 'test' }
  }
}
```

## 设计稿及尺寸单位

在 Taro 中尺寸单位建议使用 px、百分比 %，Taro 默认会对所有单位进行转换。在 Taro 中书写尺寸按照 1:1 的关系来进行书写，即从设计稿上量的长度 100px，那么尺寸书写就是 100px，**当转成微信小程序的时候，尺寸将默认转换为 100rpx，当转成 H5 时将默认转换以 rem 为单位的值。**

**如果你希望部分 px 单位不被转换成 rpx 或者 rem，最简单的做法就是在 px 单位中增加一个大写字母，例如 Px 或者 PX 这样，则会被转换插件忽略。**

结合过往的开发经验，Taro 默认以 750px 作为换算尺寸标准，如果设计稿不是以 750px 为标准，则需要在项目配置 config/index.js 中进行设置，例如设计稿尺寸是 640px，则需要修改项目配置 config/index.js 中的 designWidth 配置为 640：

```js
const config = {
  ...
  designWidth: 640,
  ....
}
```

目前 Taro 支持 750、640、828 三种尺寸设计稿，他们的换算规则如下：

```js
const DEVICE_RATIO = {
  "640": 2.34 / 2,
  "750": 1,
  "828": 1.81 / 2
};
```

建议使用 Taro 时，设计稿以 iPhone6 750px 作为涉及尺寸标准。

如果你的设计稿是 375，不在以上三种之中，那么你需要把 designWidth 配置为 375，同时在 DEVICE_RATIO 中添加换算规则如下：

```js
const DEVICE_RATIO = {
  "640": 2.34 / 2,
  "750": 1,
  "828": 1.81 / 2,
  "375": 2 / 1
};
```

### API

在编译时，Taro 会帮你对样式做尺寸转换操作，但是如果是在 JS 中书写行内样式，那么编译时就无法做替换了，针对这种情况，Taro 提供了 API `Taro.pxTransform` 来做运行时的尺寸转换。

```js
Taro.pxTransform(10); // 小程序：rpx，H5：rem
```

该函数 x 的表示当前元素的字体大小为 x / DEVICE_RATIO \* 1rem，如下代码表示当前元素字体大小为 50px（假设当前 screen width 为 375px）

```jsx
<View
  style={{
    fontSize: Taro.pxTransform(100)
  }}
>
  行内 CSS 书写测试 px 是否被转换
</View>
```

### 配置

默认配置会对所有的 px 单位进行转换，有大写字母的 Px 或 PX 则会被忽略

参数默认值如下：

```json
{
  "onePxTransform": true, // 设置 1px 是否需要被转换
  "unitPrecision": 5, // REM 单位允许的小数位
  "propList": ["*"],
  "selectorBlackList": [],
  "replace": true,
  "mediaQuery": false,
  "minPixelValue": 0
}
```

`Type: Object | Null`

- propList (Array)

允许转换的属性。

- Values need to be exact matches.
- Use wildcard _ to enable all properties. Example: ['_']
- Use * at the start or end of a word. (['*position\*'] will match background-position-y)
- Use ! to not match a property. Example: ['*', '!letter-spacing']
- Combine the "not" prefix with the other prefixes. Example: ['*', '!font*']

- selectorBlackList

黑名单里的选择器将会被忽略。

- If value is string, it checks to see if selector contains the string.
  ['body'] will match .body-class
- If value is regexp, it checks to see if the selector matches the regexp.
  [/^body$/] will match body but not .body

- replace (Boolean)

直接替换而不是追加一条进行覆盖。

- mediaQuery (Boolean)

允许媒体查询里的 px 单位转换

- minPixelValue (Number)

设置一个可被转换的最小 px 值

配置规则对应到 config/index.js ，例如：

```js
{
  h5: {
    publicPath: '/',
    staticDirectory: 'static',
    postcss: {
      autoprefixer: {
        enable: true
      },
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body']
        }
      }
    }
  },
  mini: {
    // ...
    postcss: {
      pxtransform: {
        enable: true,
        config: {
          selectorBlackList: ['body']
        }
      }
    }
  }
}
```

### CSS 编译时忽略（过滤）

#### 忽略单个属性

当前忽略单个属性的最简单的方法，就是 px 单位使用大写字母。

```css
/* `px` is converted to `rem` */
.convert {
  font-size: 16px; // converted to 1rem
}

/* `Px` or `PX` is ignored by `postcss-pxtorem` but still accepted by browsers */
.ignore {
  border: 1px solid; // ignored
  border-width: 2px; // ignored
}
```

#### 忽略样式文件

对于头部包含注释 `/*postcss-pxtransform disable*/` 的文件，插件不予处理。

#### 忽略样式举例

样式文件里多行文本省略时我们一般如下面的代码：

```css
.textHide {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 2;
  text-overflow: ellipsis;
  overflow: hidden;
}
```

但 Taro 编译后少了 `-webkit-box-orient: vertical;` 这条样式属性，此时我们需要忽略掉这条样式

##### 忽略样式方法 1 加入 CSS 注释强制声明忽略下一行

```css
/* autoprefixer: ignore next */
-webkit-box-orient: vertical;
```

##### 忽略样式方法 2 加入 CSS 注释强制声明注释中间多行

```css
/* autoprefixer: off */
-webkit-box-orient: vertical;
/* autoprefixer: on */
```

##### 忽略样式方法 3 写成行内样式

```jsx
<View
  style={{
    display: "-webkit-box",
    "-webkit-box-orient": "vertical",
    "-webkit-line-clamp": 2,
    "text-overflow": "ellipsis",
    overflow: "hidden",
    "line-height": 2
  }}
>
  这是要省略的内容这是要省略的内容这是要省略的内容
</View>
```

#### 相关链接

- [Taro 多行文本省略不生效](https://taro-club.jd.com/topic/2270/taro%E5%A4%9A%E8%A1%8C%E6%96%87%E6%9C%AC%E7%9C%81%E7%95%A5%E4%B8%8D%E7%94%9F%E6%95%88)

## 静态资源引用

在 Taro 中可以像使用 Webpack 那样自由地引用静态资源，而且不需要安装任何 Loaders。

### 引用 JSON 文件

可以直接通过 ES6 的 import 语法来引用此类文件，拿到 JSON 文件输出的 JSON 数据

```js
// 引用 json 文件
/**
 * named.json
 * {
 *   x: 1
 * }
 **/
import namedJson from "../../json/path/named.json";

console.log(namedJson.x);
```

### 小程序样式中引用本地资源

在小程序的样式中，默认不能直接引用本地资源，只能通过网络地址、Base64 的方式来进行资源引用，为了方便开发，Taro 提供了直接在样式文件中引用本地资源的方式，其原理是通过 PostCSS 的 [postcss-url](https://github.com/postcss/postcss-url) 插件将样式中本地资源引用转换成 Base64 格式，从而能正常加载。

Taro 默认会对 1kb 大小以下的资源进行转换，如果需要修改配置，可以在 config/index.js 中进行修改，配置位于 [weapp.module.postcss](https://taro-docs.jd.com/taro/docs/config-detail#weappmodulepostcss)。

具体配置如下

```js
// 小程序端样式引用本地资源内联
url: {
  enable: true,
  config: {
    limit: 10240 // 设定转换尺寸上限
  }
}
```
