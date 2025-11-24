# 门户网站后端 API

基于 Node.js + Express + TypeScript 的后端 API 服务。

## 功能特性

- 🔐 JWT 用户认证
- 📝 文章 CRUD 操作
- 🔍 搜索和筛选
- 🛡️ 安全防护（Helmet、CORS、速率限制）
- 📊 日志记录
- ⚡ 性能优化（Gzip 压缩）

## 快速开始

### 安装依赖
```bash
npm install
```

### 启动开发服务器
```bash
npm run dev
```

### 构建生产版本
```bash
npm run build
npm start
```

## API 接口

### 认证
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

### 文章
- `GET /api/articles` - 获取文章列表
- `GET /api/articles/:id` - 获取文章详情
- `GET /api/articles/hot` - 获取热门文章
- `GET /api/articles/recommend` - 获取推荐文章
- `GET /api/articles/search` - 搜索文章

### 分类
- `GET /api/categories` - 获取分类列表

### 用户
- `GET /api/user/info` - 获取用户信息（需认证）
- `PUT /api/user/info` - 更新用户信息（需认证）

## 环境变量

创建 `.env` 文件：
```env
PORT=3000
NODE_ENV=development
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:5173
```

## 技术栈

- Express.js
- TypeScript
- JWT (jsonwebtoken)
- BCrypt
- Helmet
- Morgan
- CORS
- Compression
