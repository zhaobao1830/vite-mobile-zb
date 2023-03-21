const { defineConfig } = require('eslint-define-config')

module.exports = defineConfig({
  root: true,
  env: {
    node: true,
    'vue/setup-compiler-macros': true // 新增的配置
  },
  extends: [
    'plugin:vue/vue3-essential'
  ],
  parser: 'vue-eslint-parser',
  rules: {
    "space-before-function-paren": 0, // 忽略空格
    "vue/script-indent": [ // script区域缩进俩格
      "error",
      2,
      {
        // script标签缩进设置
        baseIndent: 1,
        switchCase: 0,
        ignores: []
      }
    ],
    quotes: ['error', 'single'], // 强制使用单引号
    indent: ["error", 2], // 强制前面空俩格
    semi: ["error", "never"], // 无分号
    "vue/multi-word-component-names": ["error", {
      "ignores": ['loading', 'home', 'login', 'ruler', 'message']
    }]
  },
  overrides: [
    {
      files: ["*.vue"],
      rules: {
        indent: "off"
      }
    }
  ]
})
