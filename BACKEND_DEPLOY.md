# 🚀 后端部署指南

## 为什么前后端分开部署？

### 前端（Vercel）
- ✅ 静态文件托管
- ✅ CDN 全球加速
- ✅ 自动 HTTPS
- ✅ 完美支持 SPA

### 后端（Railway/Render）
- ✅ 持续运行的服务
- ✅ 数据库连接
- ✅ 无执行时间限制
- ✅ 完整的 Node.js 环境

---

## 🎯 推荐方案对比

| 平台 | 难度 | 免费额度 | 数据库 | 推荐度 |
|------|------|----------|--------|--------|
| **Railway** | ⭐ | $5/月 | ✅ 内置 | ⭐⭐⭐⭐⭐ |
| **Render** | ⭐⭐ | 免费 | ✅ 内置 | ⭐⭐⭐⭐ |
| **Fly.io** | ⭐⭐⭐ | 免费 | ⚠️ 需配置 | ⭐⭐⭐ |
| **自建 VPS** | ⭐⭐⭐⭐ | 按需 | ✅ 自建 | ⭐⭐⭐⭐ |

---

## 🚂 方案一：Railway 部署（最推荐）

### 为什么选择 Railway？

- ✅ **最简单** - 类似 Vercel 的体验
- ✅ **自动检测** - 识别 Node.js + Prisma
- ✅ **一键数据库** - PostgreSQL 自动配置
- ✅ **免费额度** - 每月 $5 免费额度
- ✅ **自动 HTTPS** - 提供域名和证书

### 步骤 1：创建 Railway 账号

1. 访问：https://railway.app
2. 使用 GitHub 登录
3. 验证账号

### 步骤 2：创建新项目

1. 点击 **"New Project"**
2. 选择 **"Deploy from GitHub repo"**
3. 选择仓库：`zhx83752021/portalsite-ve`
4. 点击 **"Deploy"**

### 步骤 3：配置项目

#### 3.1 设置根目录

1. 进入项目设置
2. 找到 **"Root Directory"**
3. 设置为：`portal-backend`
4. 保存

#### 3.2 添加 PostgreSQL 数据库

1. 点击 **"New"** → **"Database"** → **"Add PostgreSQL"**
2. Railway 会自动创建数据库
3. 数据库 URL 会自动注入到环境变量 `DATABASE_URL`

#### 3.3 配置环境变量

点击项目 → **"Variables"** 添加：

```env
# 数据库（已自动配置）
DATABASE_URL=${{Postgres.DATABASE_URL}}

# JWT 配置
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

# CORS 配置（重要！）
CORS_ORIGIN=https://your-frontend.vercel.app

# 应用配置
NODE_ENV=production
PORT=3000

# 密码加密
BCRYPT_ROUNDS=10

# 速率限制
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# 日志级别
LOG_LEVEL=info
```

⚠️ **重要**：
- 将 `CORS_ORIGIN` 改为你的 Vercel 前端地址
- 将 `JWT_SECRET` 改为强随机密钥

### 步骤 4：运行数据库迁移

Railway 会自动检测 `package.json` 中的脚本。

添加部署脚本到 `portal-backend/package.json`：

```json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/app.js",
    "deploy": "prisma migrate deploy && prisma db seed"
  }
}
```

或在 Railway 控制台手动运行：
1. 进入项目
2. 点击 **"Deploy Logs"**
3. 等待部署完成后，点击 **"Shell"**
4. 运行命令：
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### 步骤 5：获取后端 URL

1. 部署完成后，Railway 会提供一个 URL
2. 格式：`https://your-project.up.railway.app`
3. 复制这个 URL

### 步骤 6：更新前端配置

回到 Vercel 前端项目：
1. 进入 Settings → Environment Variables
2. 更新 `VITE_API_BASE_URL`：
   ```
   https://your-project.up.railway.app/api
   ```
3. 重新部署前端

---

## 🎨 方案二：Render 部署

### 优势
- ✅ 完全免费（有限制）
- ✅ 自动 HTTPS
- ✅ 内置 PostgreSQL
- ⚠️ 免费版会休眠（15分钟无请求）

### 步骤

1. **创建账号**
   - 访问：https://render.com
   - GitHub 登录

2. **创建 Web Service**
   - 点击 "New +" → "Web Service"
   - 连接 GitHub 仓库
   - 选择 `zhx83752021/portalsite-ve`

3. **配置设置**
   ```
   Name: portal-backend
   Region: Singapore (最近)
   Branch: main
   Root Directory: portal-backend
   Runtime: Node
   Build Command: npm install && npx prisma generate && npm run build
   Start Command: npm start
   ```

4. **添加 PostgreSQL**
   - Dashboard → "New +" → "PostgreSQL"
   - 复制 Internal Database URL

5. **配置环境变量**
   ```env
   DATABASE_URL=<从上面复制>
   NODE_ENV=production
   JWT_SECRET=your-secret-key
   CORS_ORIGIN=https://your-frontend.vercel.app
   ```

6. **手动运行迁移**
   - 部署完成后
   - 在 Shell 中运行：
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

---

## 🐳 方案三：Docker 部署到 VPS

### 适合场景
- 需要完全控制
- 已有服务器
- 需要自定义配置

### 使用项目中的 Docker 配置

```bash
# 1. SSH 到服务器
ssh user@your-server.com

# 2. 克隆仓库
git clone https://github.com/zhx83752021/portalsite-ve.git
cd portalsite-ve

# 3. 配置环境变量
cp .env.docker .env
nano .env  # 修改配置

# 4. 启动服务
docker-compose up -d

# 5. 运行迁移
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed
```

---

## 🔗 前后端连接配置

### 1. 后端 CORS 配置

确保 `portal-backend/.env.production` 中：
```env
CORS_ORIGIN=https://your-frontend.vercel.app
```

支持多个域名：
```env
CORS_ORIGIN=https://your-frontend.vercel.app,https://yourdomain.com
```

### 2. 前端 API 配置

Vercel 环境变量：
```env
VITE_API_BASE_URL=https://your-backend.railway.app/api
```

### 3. 测试连接

部署完成后测试：
```bash
# 测试后端健康检查
curl https://your-backend.railway.app/health

# 应该返回：
{
  "status": "ok",
  "timestamp": "2024-11-24T...",
  "database": "connected"
}
```

---

## 📋 完整部署流程总结

### 第一步：部署后端

1. **选择平台**（推荐 Railway）
2. **创建项目**，连接 GitHub 仓库
3. **设置根目录**：`portal-backend`
4. **添加 PostgreSQL** 数据库
5. **配置环境变量**（特别是 CORS_ORIGIN）
6. **运行数据库迁移**
7. **获取后端 URL**

### 第二步：部署前端

1. **Vercel 创建项目**
2. **设置根目录**：`portal-frontend`
3. **添加环境变量**：
   ```env
   VITE_API_BASE_URL=<后端URL>/api
   ```
4. **部署**

### 第三步：验证

1. 访问前端 URL
2. 测试登录功能
3. 检查 API 请求是否正常
4. 查看浏览器控制台无错误

---

## 🛠️ 常见问题

### ❌ CORS 错误

**错误信息**：
```
Access to fetch at 'https://backend.com/api/...' from origin 'https://frontend.com' has been blocked by CORS
```

**解决方案**：
1. 检查后端 `CORS_ORIGIN` 环境变量
2. 确保包含前端完整域名（带 https://）
3. 重启后端服务

### ❌ 数据库连接失败

**错误信息**：
```
PrismaClientInitializationError: Can't reach database server
```

**解决方案**：
1. 检查 `DATABASE_URL` 格式
2. 确保数据库服务正在运行
3. 检查防火墙规则
4. Railway/Render 会自动配置，无需手动设置

### ❌ Prisma 迁移失败

**解决方案**：
```bash
# 1. 生成 Prisma Client
npx prisma generate

# 2. 运行迁移
npx prisma migrate deploy

# 3. 如果还有问题，重置数据库（⚠️ 会删除数据）
npx prisma migrate reset
```

---

## 💰 成本估算

### Railway
- **免费额度**：$5/月
- **基础后端**：约 $5/月（刚好用完免费额度）
- **数据库**：包含在内
- **流量**：100GB/月

### Render
- **免费版**：完全免费
- **限制**：15分钟无请求会休眠
- **付费版**：$7/月起（无休眠）

### 自建 VPS
- **Vultr/DigitalOcean**：$5-6/月
- **完全控制**
- **需要自己维护**

---

## 🎯 推荐配置（最佳实践）

### 个人项目/演示
```
前端：Vercel（免费）
后端：Render 免费版
数据库：Render PostgreSQL（免费）
总成本：$0
```

### 小型生产环境
```
前端：Vercel（免费）
后端：Railway
数据库：Railway PostgreSQL
总成本：$5-10/月
```

### 中型生产环境
```
前端：Vercel Pro（$20/月）
后端：Render Standard（$7/月）
数据库：Supabase/Railway（$5-10/月）
总成本：$32-37/月
```

---

## 📚 相关文档

- [Railway 文档](https://docs.railway.app/)
- [Render 文档](https://render.com/docs)
- [Prisma 生产部署](https://www.prisma.io/docs/guides/deployment)

---

## ✅ 部署检查清单

### 后端部署
- [ ] 平台选择完成（Railway/Render）
- [ ] 项目创建并连接 GitHub
- [ ] Root Directory 设置为 `portal-backend`
- [ ] PostgreSQL 数据库已创建
- [ ] 环境变量已配置（特别是 CORS_ORIGIN）
- [ ] 数据库迁移已运行
- [ ] 种子数据已导入
- [ ] 健康检查接口可访问
- [ ] 后端 URL 已获取

### 前端配置
- [ ] VITE_API_BASE_URL 已更新为后端地址
- [ ] Vercel 重新部署完成
- [ ] 登录功能正常
- [ ] API 请求无 CORS 错误
- [ ] 浏览器控制台无错误

---

**最后更新**: 2024-11-24
**推荐方案**: Railway（最简单）或 Render（完全免费）
