# 🚂 Railway 部署指南（分步骤）

本指南将帮您一步步完成后端部署到 Railway。

## 📋 准备工作

确保您有：
- ✅ GitHub 账号
- ✅ 代码已推送到 GitHub 仓库
- ✅ Vercel 前端地址：`https://portalsite-ve.vercel.app`

---

## 🚀 第一步：创建 Railway 账号

1. **访问 Railway**：https://railway.app
2. **点击 "Login"**
3. **选择 "Login with GitHub"**
4. **授权 Railway 访问您的 GitHub**

---

## 🎯 第二步：创建新项目

1. **登录后，点击右上角 "New Project"**
2. **选择 "Deploy from GitHub repo"**
3. **找到并选择仓库**：`zhx83752021/portalsite-ve`
4. **点击 "Add variables"（先不要点 Deploy）**

---

## ⚙️ 第三步：配置根目录

在部署之前，需要设置根目录：

1. **在项目设置中找到 "Settings" 标签**
2. **找到 "Root Directory"**
3. **输入**：`portal-backend`
4. **点击 "Save"**

---

## 🗄️ 第四步：添加 PostgreSQL 数据库

1. **在项目页面点击 "New"**
2. **选择 "Database"**
3. **选择 "Add PostgreSQL"**
4. **等待数据库创建完成**（约 30 秒）
5. **Railway 会自动创建 `DATABASE_URL` 环境变量**

---

## 🔧 第五步：配置环境变量

点击后端服务 → **"Variables"** 标签 → 添加以下变量：

### 必需的环境变量

```env
NODE_ENV=production
PORT=3000
JWT_SECRET=Portal2024SecureKey!ChangeMeInProduction
JWT_EXPIRES_IN=7d
CORS_ORIGIN=https://portalsite-ve.vercel.app
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
LOG_LEVEL=info
```

### ⚠️ 重要说明

- `DATABASE_URL` - Railway 会自动注入，**不需要手动添加**
- `CORS_ORIGIN` - **必须**设置为您的 Vercel 前端地址
- `JWT_SECRET` - 建议修改为更强的密钥

### 如何添加变量

1. 点击 "New Variable"
2. 输入变量名和值
3. 点击 "Add"
4. 重复以上步骤添加所有变量

---

## 🚀 第六步：部署

1. **点击 "Deploy"** 或等待自动部署
2. **查看部署日志**：点击 "Deployments" 标签
3. **等待构建完成**（约 2-3 分钟）

### 构建过程

您会看到以下步骤：
- ✅ 安装依赖
- ✅ 生成 Prisma Client
- ✅ TypeScript 编译
- ✅ 运行数据库迁移
- ✅ 启动服务

---

## 📡 第七步：获取后端 URL

部署成功后：

1. **点击 "Settings" 标签**
2. **找到 "Domains" 部分**
3. **点击 "Generate Domain"**
4. **复制生成的域名**，格式类似：
   ```
   https://portal-backend-production-xxxx.up.railway.app
   ```

---

## 🌐 第八步：更新前端配置

现在需要让 Vercel 前端连接到 Railway 后端：

### 8.1 登录 Vercel Dashboard

1. 访问：https://vercel.com/dashboard
2. 进入您的项目：`portalsite-ve`

### 8.2 更新环境变量

1. **点击 "Settings"**
2. **点击左侧 "Environment Variables"**
3. **找到 `VITE_API_BASE_URL` 变量**
4. **点击编辑（铅笔图标）**
5. **修改值为**：
   ```
   https://你的railway域名/api
   ```
   例如：
   ```
   https://portal-backend-production-xxxx.up.railway.app/api
   ```
6. **选择所有环境**：Production, Preview, Development
7. **点击 "Save"**

### 8.3 重新部署前端

1. **点击 "Deployments" 标签**
2. **找到最新的部署**
3. **点击右侧的三个点 "..."**
4. **选择 "Redeploy"**
5. **点击 "Redeploy"** 确认

---

## ✅ 第九步：测试连接

### 9.1 测试后端健康检查

在浏览器打开：
```
https://你的railway域名/health
```

应该看到：
```json
{
  "status": "ok",
  "timestamp": "2024-11-24T...",
  "database": "connected"
}
```

### 9.2 测试前端连接

1. 打开前端：https://portalsite-ve.vercel.app
2. 尝试登录或浏览内容
3. **打开浏览器控制台**（F12）检查是否有错误

---

## 🛠️ 故障排查

### ❌ 数据库连接失败

**症状**：后端日志显示数据库连接错误

**解决**：
1. 检查 `DATABASE_URL` 是否自动注入
2. 确保 PostgreSQL 服务正在运行
3. 在 Railway 项目中查看数据库状态

### ❌ CORS 错误

**症状**：前端控制台显示 CORS 错误

**解决**：
1. 检查 `CORS_ORIGIN` 环境变量
2. 确保包含完整的前端 URL（带 https://）
3. 重新部署后端

### ❌ Prisma 迁移失败

**症状**：部署日志中显示迁移错误

**解决**：
1. 在 Railway 项目中打开 "Shell"
2. 运行：
   ```bash
   npx prisma migrate deploy
   npx prisma db seed
   ```

### ❌ 构建超时

**症状**：构建过程卡住或超时

**解决**：
1. 检查 `package.json` 中的脚本
2. 确保所有依赖都在 `dependencies` 中
3. 重新触发部署

---

## 📊 监控和日志

### 查看日志

1. 进入 Railway 项目
2. 点击后端服务
3. 点击 "Deployments" 标签
4. 选择当前部署
5. 查看实时日志

### 查看指标

1. 点击 "Metrics" 标签
2. 查看 CPU、内存、网络使用情况

---

## 💰 费用说明

Railway 提供：
- **$5 免费额度/月**
- 基础后端应用约消耗 **$5-8/月**
- 超出免费额度部分需付费

### 优化成本

1. **优化内存使用**
2. **减少不必要的日志**
3. **使用休眠策略**（如适用）

---

## 🎉 完成！

现在您的全栈应用已完全部署：

- ✅ **前端**：https://portalsite-ve.vercel.app
- ✅ **后端**：https://你的railway域名
- ✅ **数据库**：Railway PostgreSQL

---

## 📞 需要帮助？

如遇到问题：
1. 查看 Railway 部署日志
2. 查看 Vercel 部署日志
3. 检查浏览器控制台错误
4. 参考本文档的故障排查部分

---

**创建时间**：2024-11-24
**适用版本**：Railway v2, Node.js 20+
