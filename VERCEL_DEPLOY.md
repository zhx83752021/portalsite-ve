# 📦 Vercel 部署指南

## 🚀 快速部署前端

### 1. 导入项目

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 **"Add New Project"**
3. 选择 **"Import Git Repository"**
4. 输入仓库地址：`https://github.com/zhx83752021/portalsite-ve.git`
5. 点击 **"Import"**

### 2. 配置项目

#### 📁 项目设置

**Root Directory（根目录）**：
```
portal-frontend
```

**Framework Preset（框架预设）**：
```
Vite
```

**Build Command（构建命令）**：
```
npm run build
```

**Output Directory（输出目录）**：
```
dist
```

**Install Command（安装命令）**：
```
npm install
```

#### 🔧 环境变量

点击 **"Environment Variables"** 添加：

| 变量名 | 值 | 说明 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `/api` 或后端地址 | API 基础路径 |
| `VITE_APP_TITLE` | `门户网站` | 应用标题 |

**示例**：
```env
VITE_API_BASE_URL=https://your-backend.vercel.app/api
VITE_APP_TITLE=门户网站
```

### 3. 部署

1. 确认所有配置正确
2. 点击 **"Deploy"**
3. 等待构建完成（约 1-2 分钟）

---

## 🛠️ 问题排查

### ❌ 404 NOT_FOUND 错误

**原因**：路由配置问题

**解决方案**：
1. 确认项目根目录为 `portal-frontend`
2. 检查 `vercel.json` 配置：

```json
{
    "buildCommand": "npm run build",
    "outputDirectory": "dist",
    "framework": "vite",
    "rewrites": [
        {
            "source": "/(.*)",
            "destination": "/index.html"
        }
    ]
}
```

3. 重新部署

### ❌ 构建失败

**原因**：依赖安装问题

**解决方案**：
1. 检查 Node.js 版本（需要 >= 18）
2. 在 Vercel 项目设置中设置 Node.js 版本：
   - Settings → General → Node.js Version → `18.x`
3. 重新部署

### ❌ 静态资源加载失败

**原因**：路径问题

**解决方案**：
1. 检查 `vite.config.ts` 中的 `base` 配置：
```typescript
export default defineConfig({
  base: '/', // 确保是根路径
  // ...
})
```

2. 清除缓存重新部署：
   - Deployments → 选择最新部署 → ... → Redeploy

---

## 🔧 高级配置

### 自定义域名

1. 进入项目 → Settings → Domains
2. 添加自定义域名
3. 配置 DNS 记录（Vercel 会提供指引）
4. 等待 DNS 生效（最多 48 小时）

### 环境变量管理

**开发环境**：
```env
VITE_API_BASE_URL=/api
```

**生产环境**：
```env
VITE_API_BASE_URL=https://api.yourdomain.com
```

在 Vercel 中分别设置：
- Development
- Preview
- Production

### 性能优化

已在 `vercel.json` 中配置：
- ✅ 静态资源缓存（1年）
- ✅ 安全头配置
- ✅ SPA 路由重写

---

## 📊 部署后检查清单

### ✅ 基础功能
- [ ] 首页可以访问
- [ ] 路由跳转正常
- [ ] API 请求正常（如果已配置后端）
- [ ] 静态资源加载正常

### ✅ 性能检查
- [ ] Lighthouse 评分 > 90
- [ ] 首屏加载时间 < 2s
- [ ] 静态资源有缓存头

### ✅ 安全检查
- [ ] HTTPS 已启用
- [ ] 安全头已配置
- [ ] CSP 策略正确

---

## 🔄 持续部署

### 自动部署

Vercel 已自动配置：
- ✅ `main` 分支推送 → 生产环境部署
- ✅ 其他分支推送 → 预览环境部署
- ✅ Pull Request → 自动创建预览

### 手动部署

```bash
# 1. 安装 Vercel CLI
npm i -g vercel

# 2. 登录
vercel login

# 3. 部署
cd portal-frontend
vercel --prod
```

---

## 🎯 部署后端（可选）

### 方式一：Vercel Serverless（不推荐）

Vercel 对 Node.js 后端有限制：
- ⚠️ 无法运行持久化服务
- ⚠️ 数据库连接复杂
- ⚠️ Prisma 需要特殊配置

### 方式二：其他平台（推荐）

建议后端部署到：

| 平台 | 适用场景 | 难度 |
|------|----------|------|
| **Railway** | 全栈应用 | ⭐⭐ |
| **Render** | 全栈应用 | ⭐⭐ |
| **Fly.io** | Docker 应用 | ⭐⭐⭐ |
| **VPS（Docker）** | 完全控制 | ⭐⭐⭐ |

**推荐配置**：
- 前端：Vercel
- 后端：Railway/Render
- 数据库：Supabase/Railway

---

## 📝 部署示例

### 完整流程

1. **前端部署到 Vercel**
   ```bash
   # 已完成 ✅
   https://your-project.vercel.app
   ```

2. **后端部署到 Railway**
   ```bash
   # 1. 创建 Railway 项目
   # 2. 连接 GitHub 仓库
   # 3. 选择 portal-backend 目录
   # 4. 添加 PostgreSQL 数据库
   # 5. 配置环境变量
   # 6. 部署
   ```

3. **更新前端 API 地址**
   ```env
   # Vercel 环境变量
   VITE_API_BASE_URL=https://your-backend.railway.app/api
   ```

4. **重新部署前端**

---

## 🔗 相关资源

- [Vercel 官方文档](https://vercel.com/docs)
- [Vite 部署指南](https://vitejs.dev/guide/static-deploy.html)
- [Vue Router History 模式](https://router.vuejs.org/guide/essentials/history-mode.html)

---

## 📞 获取帮助

### 部署问题
1. 查看 Vercel 构建日志
2. 检查浏览器控制台错误
3. 查看本文档的问题排查部分

### 联系支持
- Vercel 支持：https://vercel.com/support
- GitHub Issues：https://github.com/zhx83752021/portalsite-ve/issues

---

**最后更新**: 2024-11-24
**部署状态**: ✅ 配置已优化
