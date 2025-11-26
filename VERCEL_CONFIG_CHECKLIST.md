# 🔧 Vercel 配置检查清单

## ✅ 前端项目配置 (portalsite-ve)

### 1. 环境变量配置

登录 Vercel → 选择前端项目 → Settings → Environment Variables

**必须配置以下变量（Production 环境）**：

| 变量名 | 值 | 检查 |
|--------|-----|------|
| `VITE_API_BASE_URL` | `https://portalsite-backend.vercel.app/api` | [ ] |
| `VITE_APP_TITLE` | `门户网站` | [ ] |

**⚠️ 重要**：
- 确保选择的是 **Production** 环境
- 配置完成后必须重新部署才能生效

---

## ✅ 后端项目配置 (portalsite-backend)

### 1. 环境变量配置

登录 Vercel → 选择后端项目 → Settings → Environment Variables

**必须配置以下变量（Production 环境）**：

| 变量名 | 值 | 检查 |
|--------|-----|------|
| `NODE_ENV` | `production` | [ ] |
| `CORS_ORIGIN` | `https://www.clm-tug.com,https://clm-tug.com,https://portalsite-ve.vercel.app` | [ ] |
| `JWT_SECRET` | `你的强密钥（至少32位）` | [ ] |
| `DATABASE_URL` | `postgresql://...` | [ ] |

**可选配置**：

| 变量名 | 值 | 默认值 |
|--------|-----|--------|
| `JWT_EXPIRES_IN` | `7d` | 7d |
| `PORT` | `3000` | 3000 |
| `RATE_LIMIT_WINDOW_MS` | `900000` | 900000 |
| `RATE_LIMIT_MAX_REQUESTS` | `100` | 100 |
| `BCRYPT_ROUNDS` | `10` | 10 |
| `LOG_LEVEL` | `info` | info |

**⚠️ 关键点**：
- `CORS_ORIGIN` 必须包含你的自定义域名（用逗号分隔，无空格）
- `JWT_SECRET` 必须设置强密钥
- 配置完成后必须重新部署

---

## 🚀 部署检查

### 1. 重新部署前端
- [ ] Vercel → 前端项目 → Deployments
- [ ] 选择最新部署 → 点击 `...` → Redeploy
- [ ] 等待部署完成（约1-2分钟）

### 2. 重新部署后端
- [ ] Vercel → 后端项目 → Deployments
- [ ] 选择最新部署 → 点击 `...` → Redeploy
- [ ] 等待部署完成（约1-2分钟）

---

## 🧪 测试步骤

### 1. 测试后端健康检查
在浏览器访问：
```
https://portalsite-backend.vercel.app/health
```

**预期结果**：
```json
{
  "status": "ok",
  "timestamp": "2024-11-26T...",
  "uptime": 123.456
}
```

### 2. 测试 CORS 配置
打开浏览器控制台（F12），访问前端网站：
```
https://www.clm-tug.com
```

**检查**：
- [ ] Console 面板无 CORS 错误
- [ ] Network 面板能看到 API 请求
- [ ] API 请求状态码为 200 或其他正常状态码（非 CORS 错误）

### 3. 测试 API 请求
在前端网站点击任意功能（如首页新闻列表）

**检查 Network 面板**：
- [ ] 请求 URL 正确（指向 `https://portalsite-backend.vercel.app/api/...`）
- [ ] 请求头包含正确的 Origin
- [ ] 响应头包含 `Access-Control-Allow-Origin`

---

## ❌ 常见错误排查

### 错误 1：CORS 错误
```
Access to XMLHttpRequest at 'https://...' from origin 'https://www.clm-tug.com'
has been blocked by CORS policy
```

**解决方案**：
1. 检查后端 `CORS_ORIGIN` 环境变量是否包含 `https://www.clm-tug.com`
2. 确认后端已重新部署
3. 清除浏览器缓存

### 错误 2：网络错误 / 请求失败
```
Network Error / Request Failed
```

**解决方案**：
1. 检查前端 `VITE_API_BASE_URL` 是否正确配置
2. 确认前端已重新部署
3. 测试后端健康检查接口是否正常

### 错误 3：404 Not Found
```
404 接口不存在
```

**解决方案**：
1. 检查 API 路径是否正确（应包含 `/api` 前缀）
2. 确认后端路由配置正确
3. 检查后端 `vercel.json` 配置

### 错误 4：环境变量未生效
```
使用了默认值或配置不正确
```

**解决方案**：
1. 确认环境变量选择的是 **Production** 环境
2. 配置后必须 **重新部署**
3. 清除部署缓存后重新部署

---

## 🔍 浏览器控制台诊断

打开浏览器控制台（F12），在 Console 中运行：

```javascript
// 查看前端使用的 API 地址
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)

// 测试后端连接
fetch('https://portalsite-backend.vercel.app/health')
  .then(r => r.json())
  .then(d => console.log('后端健康检查:', d))
  .catch(e => console.error('后端连接失败:', e))

// 测试 CORS
fetch('https://portalsite-backend.vercel.app/api/article', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
})
  .then(r => r.json())
  .then(d => console.log('API 响应:', d))
  .catch(e => console.error('API 请求失败:', e))
```

---

## 📞 如果问题仍未解决

### 1. 检查 Vercel 部署日志
- Vercel → 项目 → Deployments → 点击最新部署
- 查看 **Build Logs** 和 **Function Logs**
- 寻找错误信息

### 2. 查看浏览器 Network 详情
- F12 → Network 面板
- 刷新页面
- 点击失败的请求
- 查看 Headers、Preview、Response 标签页
- 截图并检查具体错误

### 3. 验证环境变量
在 Vercel 项目设置中，确认环境变量：
- 没有多余的空格
- 使用的是正确的环境（Production）
- 值的格式正确（特别是 CORS_ORIGIN 的逗号分隔）

---

**最后更新**: 2024-11-26
