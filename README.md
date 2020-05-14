简体中文

# 压缩，复制，上传到指定服务器位置

<a href="https://circleci.com/gh/ykfe"><img src="https://img.shields.io/circleci/build/github/ykfe/dclone/master.svg" alt="Build Status"></a>
<a href="https://codecov.io/gh/ykfe/dclone"><img src="https://codecov.io/gh/ykfe/dclone/branch/master/graph/badge.svg" alt="Coverage Status"></a>
<a href="https://npmcharts.com/compare/dclone"><img src="https://img.shields.io/npm/dt/dclone" alt="download"></a>
<a href="https://standardjs.com"><img src="https://img.shields.io/badge/code_style-standard-brightgreen.svg" alt="standardjs"></a>
<a href="https://github.com/facebook/jest"><img src="https://img.shields.io/badge/tested_with-jest-99424f.svg" alt="License"></a>
<a href="https://github.com/ykfe/egg-react-ssr"><img src="https://img.shields.io/npm/l/vue.svg" alt="License"></a>
<img src="https://img.shields.io/badge/node-%3E=8-green.svg" alt="Node">

upload-with-ssh一下简称uws是最简单的命令帮组你日常压缩，复制文件，同时也支持上传服务器指定位置

## 特性

让我们来介绍一下uws有哪些特点吧

- 你可以更加便捷的发布项目到服务器指定前端目录下
- 简单，你只需要按照提示输入对应信息，或者本地增加一个配置文件即可快速发布

![](./image/time.jpg)

## 如何使用


```bash
$ npm i -g upload-with-ssh
$ uws -h
```

```bash
$ 配置文件，可以在根目录添加uws-config.js文件,代码块如下
```
```
module.exports = function () {
    return {
        host:'10.1**.*.*',
        username: '2222',
        password: '1111@123'
    }
}
```