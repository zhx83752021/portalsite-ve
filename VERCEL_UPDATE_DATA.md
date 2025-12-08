# 📊 Vercel 生产环境数据更新指南

## 问题说明

后端代码已更新并部署到 Vercel (https://portalsite-backend.vercel.app)，但数据库中仍是旧的测试数据，需要重新播种数据库以应用真实数据。

## 🎯 更新方案

### 方案一：本地连接生产数据库更新（推荐）

#### 1. 获取生产数据库连接字符串

登录 Vercel Dashboard：

1. 进入项目：https://vercel.com/dashboard
2. 选择后端项目 `portalsite-backend`
3. 点击 **Storage** 标签
4. 找到 PostgreSQL 数据库
5. 点击 **Connection String** → 复制 **Prisma** 格式的连接字符串

#### 2. 在本地执行数据播种

```bash
cd portal-backend

# 设置生产数据库URL（临时环境变量）
# Windows PowerShell:
$env:DATABASE_URL="postgresql://你的生产数据库连接字符串"

# Linux/Mac:
export DATABASE_URL="postgresql://你的生产数据库连接字符串"

# 执行数据播种
npx prisma db seed

# 验证数据
npx prisma studio
```

#### 3. 验证更新

访问前端网站 https://www.clm-tug.com/ 查看数据是否已更新。

---

### 方案二：通过 Vercel CLI（备选）

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 登录 Vercel

```bash
vercel login
```

#### 3. 连接到项目

```bash
cd portal-backend
vercel link
```

选择：

- Scope: 你的账号
- Link to existing project: Yes
- Project: portalsite-backend

#### 4. 在生产环境执行命令

```bash
# 拉取生产环境变量
vercel env pull .env.production.local

# 执行播种
npx prisma db seed --env-file=.env.production.local
```

---

### 方案三：创建临时 API 端点

如果上述方法都不可行，可以创建一个临时的管理端点来触发数据播种。

#### 1. 创建播种端点

在 `portal-backend/src/routes/` 创建临时文件：

```typescript
// admin-seed.ts
import { Router } from "express";
import { execSync } from "child_process";

const router = Router();

// 临时端点 - 使用后应立即删除
router.post("/admin/seed-database/:secret", async (req, res) => {
  const { secret } = req.params;

  // 设置一个强密钥，例如：MySuperSecret2024!
  if (secret !== process.env.SEED_SECRET) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  try {
    // 执行数据播种
    execSync("npx prisma db seed", { stdio: "inherit" });
    res.json({ success: true, message: "Database seeded successfully" });
  } catch (error) {
    res.status(500).json({ error: "Seed failed", details: error.message });
  }
});

export default router;
```

#### 2. 注册路由

在 `app.ts` 中：

```typescript
import seedRouter from "./routes/admin-seed";
app.use("/api", seedRouter);
```

#### 3. 在 Vercel 添加环境变量

在 Vercel 项目设置中添加：

```
SEED_SECRET=MySuperSecret2024!
```

#### 4. 部署并触发

```bash
# 部署更新
vercel --prod

# 访问端点触发播种
curl -X POST https://portalsite-backend.vercel.app/api/admin/seed-database/MySuperSecret2024!
```

#### 5. 删除临时代码

⚠️ **重要**：播种完成后立即删除此临时端点代码并重新部署！

---

## 🔍 验证数据更新

### 1. 检查后端 API

访问：

```
https://portalsite-backend.vercel.app/api/articles?page=1&pageSize=5
```

应该看到真实的文章数据，而不是"这是第 X 条新闻"这样的占位符。

### 2. 检查前端显示

访问：https://www.clm-tug.com/

- 首页应显示真实新闻标题
- 点击进入文章详情页查看内容
- 检查评论区是否有真实评论

### 3. 检查数据库（可选）

使用 Prisma Studio 连接生产数据库：

```bash
# 使用生产数据库URL
DATABASE_URL="postgresql://..." npx prisma studio
```

---

## ⚠️ 注意事项

### 数据备份

执行播种前，种子文件会清空现有数据：

```typescript
// seed.ts 中的清理代码
await prisma.favorite.deleteMany();
await prisma.comment.deleteMany();
await prisma.article.deleteMany();
await prisma.category.deleteMany();
await prisma.user.deleteMany();
```

**建议**：如果生产环境有重要数据，先备份：

```bash
# 备份数据库
pg_dump "postgresql://..." > backup.sql
```

### 管理员账号

数据播种后，管理员账号会重置为：

- 邮箱：`admin@portal.com`
- 密码：`admin123`

**重要**：登录后请立即修改管理员密码！

### CORS 配置

确保 Vercel 后端的 `CORS_ORIGIN` 环境变量包含前端域名：

```
CORS_ORIGIN=https://www.clm-tug.com,https://clm-tug.com
```

---

## 📋 快速执行清单

- [ ] 从 Vercel 获取生产数据库连接字符串
- [ ] 在本地设置 `DATABASE_URL` 环境变量
- [ ] 执行 `npx prisma db seed`
- [ ] 访问 https://www.clm-tug.com/ 验证数据
- [ ] 登录后台修改管理员密码
- [ ] 确认所有文章、评论都已更新

---

## 🆘 故障排查

### 问题：连接数据库失败

**解决**：

1. 检查数据库连接字符串格式是否正确
2. 确认 Vercel 数据库服务正在运行
3. 检查本地网络是否能访问 Vercel 数据库

### 问题：播种失败

**解决**：

1. 检查 `prisma/schema.prisma` 是否与生产数据库同步
2. 执行 `npx prisma migrate deploy` 确保迁移已应用
3. 查看错误日志定位具体问题

### 问题：前端仍显示旧数据

**解决**：

1. 清除浏览器缓存
2. 在 Vercel 重新部署前端项目
3. 检查前端 API 地址是否正确配置

---

## 📞 需要帮助？

如遇到问题：

1. 检查 Vercel 部署日志
2. 查看浏览器控制台错误
3. 确认环境变量配置正确
4. 参考本文档的故障排查部分

---

**创建时间**：2024-12-08
**适用环境**：Vercel 部署
