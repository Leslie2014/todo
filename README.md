# TODO
一个极简的 react 版本 todo 应用，用 jest+enzyme 作为测试。需要了解如何搭建 jest + enzyme 测试 React 应用的话，可以参考这个项目。

同时该项目也可以作为 React 应用的模板项目。

## ✨Fetures

- React √
- Redux √
- jest √
- enzyme √
- ES6 support √
- Sass support √
- webpack √

## 启动 & 开发

```bash
// clone 仓库
git clone https://github.com/Leslie2014/todo.git

// 安装依赖包
npm install

// 启动
npm start

// 跑测试用例
npm test
```

## 目录

```
├── CHANGELOG.md 
├── README.md
├── __mocks__ // 一些需要mock的资源
│   └── styleMock.js
├── index.html
├── package.json 
├── src // 源文件
│   ├── actions // redux action
│   ├── components
│   ├── constants
│   ├── container
│   ├── index.js
│   └── reducers // redux reducer
└── webpack.config.js // webpack 配置文件
```