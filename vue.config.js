const { defineConfig } = require('@vue/cli-service')

// 按需引入Vant插件
const { VantResolver } = require('unplugin-vue-components/resolvers');
const ComponentsPlugin = require('unplugin-vue-components/webpack');

module.exports = defineConfig({
  publicPath: "/Rinko-SSO",
  transpileDependencies: true,
  devServer: {
    port: 81
  },
  configureWebpack: {
    plugins: [
      ComponentsPlugin({
        // 按需引入Vant插件
        resolvers: [VantResolver()],
      }),
    ],
  },
})