# Taro 基础知识

## 生命周期

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
