# Book Sales System

本项目为一个基于 Node.js 的图书销售系统，包含用户注册登录、图书搜索、购物车、订单管理、后台管理等功能模块，适用于线上图书商城的基本需求。

## 项目结构

```
books.txt                // 图书数据
server.js                // 后端服务入口
ADM/                     // 管理员后台模块
AUTH/                    // 用户认证与主页模块
CART/                    // 购物车与商品详情模块
SEARCH/                  // 搜索模块
USER CENTER/             // 用户中心模块
images/                  // 图片资源
package.json             // 项目依赖配置
README.md                // 项目说明文档
```

## 功能介绍

- 用户注册、登录、信息修改
- 图书搜索与浏览
- 购物车管理、下单
- 管理员后台（图书管理、订单管理等）
- 支持多页面前端展示
- 静态资源与图片展示

## 安装与运行

1. 安装依赖

```powershell
npm install
```

2. 启动服务

```powershell
node server.js
```

3. 浏览器访问

```
http://localhost:3000
```

## 依赖环境

- Node.js
- npm

## 贡献与反馈

欢迎提交 issue 或 pull request 进行功能完善与 bug 修复。

---

如需补充详细接口文档或使用说明，请告知你的具体需求。
