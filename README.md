# Vue 3 + Vite

1、yarn preview可以预览打包后的项目

2、vite.config.js文件里alias配置
```js
resolve: {
    alias: {
      '@': '/src'
    }
  }
```
3、配置scss：

(1)、安装npm install --save-dev sass；

(2)、vite.config.js:

```js
 css: {
  // 配置全局的scss文件,vite不需要安装sass-loader
  preprocessorOptions: {
    scss: {
      additionalData: `
              @import "@/assets/scss/variable.scss";
            `
    }
  }
}   
```

4、如果webstorm和vscode不识别配置的别名，就新加jsconfig.json文件，在文件里添加baseUrl和paths文件

5、新加a-button全局组件

6、vite要求引入的文件要加扩展名，如果没有会报vite:import-analysis错，解决办法是：加上扩展名或者在vite.config.js里添加extensions配置

7、只要配置了unplugin-vue-components插件，不需要在其他地方引入组件，就可以直接使用
