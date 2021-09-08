## babel-plugin-exercize

掘金小册[《babel 插件通关秘籍》](https://sourl.co/ijmTn3)的案例代码：

- [插入函数调用参数](./exercize-parameters-insert/src)
- [自动埋点](./exercize-auto-track/src)
- [acorn 插件](./exercize-acorn-plugin-guang-keyword/src)
- [自动国际化](./exercize-auto-i18n/src/)
- [自动生成 api 文档](./exercize-auto-document/src/)
- [linter](./exercize-linter/src)
- [type checker](./exercize-type-checker/src/)
- [压缩混淆](./exercize-mangle-compress/src)
- [js 解释器](./exercize-js-interpreter/src)
- [模块遍历器](./exercize-module-iterator/src)
- [手写简易的 babel](./exercize-babel/src)

## 下载和运行

```shell
git clone https://github.com/QuarkGluonPlasma/babel-plugin-exercize

node ./exercize-linter/src/eq-lint-entry.js （或其他路径）
```

## debug

编辑 .vscode/launch.json 配置

添加一个配置如下：

```javascript
{
    "name": "exercize-auto-track/src/index.js",
    "program": "${workspaceFolder}/exercize-auto-track/src/index.js",
    "request": "launch",
    "type": "node"
}
```
然后点击 debug 面板的运行按钮，打断点调试




