import * as React from "react";
import { Component } from "react";
import { View, Text } from "@tarojs/components";
import { AtButton } from "taro-ui";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import Comp from "@/component";

import "taro-ui/dist/style/components/button.scss"; // 按需引入
import "./index.scss";
import Test from "@/component/Test";

const Header = () => <>Header</>;
const Custom: React.FC<{ num: number }> = ({ num }) => <>Custom - {num}</>;

export default class App extends Component {
  componentDidShow() {}

  componentDidHide() {}

  $instance = getCurrentInstance();

  renderHeader = (showHeader: boolean) => {
    return showHeader && <Header />;
  };

  handleClick = (e?: any) => {
    console.log("handleClick");
    console.log("e:", e);
  };

  render() {
    const numbers = [1, 2, 3, 4, 5];
    console.log(Comp);
    console.log(testVariable);
    console.log(variable);

    console.log(this.$instance.router);

    return (
      <View className="index">
        <Text
          style={{
            fontSize: "1rem"
          }}
        >
          Hello world!
        </Text>
        <View className="index-header">{this.renderHeader(true)}</View>
        <View
          style={{
            fontSize: Taro.pxTransform(100)
          }}
        >
          行内 CSS 书写测试 px 是否被转换
        </View>
        {numbers.map(number => {
          let isOdd = false;

          if (number % 2) {
            isOdd = true;
          }

          return (
            isOdd && (
              <View>
                <Custom num={number} />
              </View>
            )
          );
        })}
        <AtButton type="primary" size="small">
          按钮
        </AtButton>
        <View onClick={() => this.handleClick()}>handleClick 1</View>
        <View onClick={e => this.handleClick(e)}>handleClick 2</View>
        <Test />
      </View>
    );
  }
}
