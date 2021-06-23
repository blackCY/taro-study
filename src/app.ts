import { Component } from "react";
import "./app.scss";

class App extends Component {
  componentDidMount() {}

  // 对应 onLaunch
  onLaunch(options: any) {}

  // 对应 onShow
  componentDidShow() {}

  // 对应 onHide
  componentDidHide() {}

  componentDidCatchError() {}

  render() {
    // 在入口组件不会渲染任何内容，但我们可以在这里做类似于状态管理的事情
    // this.props.children 是将要会渲染的页面
    return this.props.children;
  }
}

export default App;
