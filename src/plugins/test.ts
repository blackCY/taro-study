import { IPluginContext } from "@tarojs/service";

export default (ctx: IPluginContext, options: any) => {
  ctx.onBuildStart(() => {
    console.log("编译开始");
  });
  ctx.onBuildFinish(() => {
    console.log("编译结束");
  });
};
