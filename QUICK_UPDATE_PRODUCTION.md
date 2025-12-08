# 🚀 快速更新生产环境数据

您的网站 https://www.clm-tug.com/ 仍显示旧数据，需要在 Vercel 后端数据库中重新播种数据。

## ⚡ 最快方法（推荐）

### 步骤 1：获取数据库连接

1. 登录 Vercel：https://vercel.com/dashboard
2. 进入后端项目：`portalsite-backend`
3. 点击 **Storage** 标签
4. 点击你的 PostgreSQL 数据库
5. 找到 **Connection String**，选择 **Prisma** 格式
6. 点击复制按钮

### 步骤 2：在本地执行播种

打开 PowerShell，执行：

```powershell
cd e:\site3\portal-backend

# 设置数据库连接（用刚复制的连接字符串替换下面的）
$env:DATABASE_URL="postgresql://你的连接字符串"

# 执行播种
npx prisma db seed
```

**预期输出**：

```
🌱 开始播种数据...
清理现有数据...
创建用户...
✓ 创建了 3 个用户
创建分类...
✓ 创建了 8 个分类
创建文章...
✓ 创建了 50 篇文章
创建评论...
✓ 创建了 30 条评论
✓ 创建了 9 条收藏记录

✅ 数据播种完成！
```

### 步骤 3：验证

访问 https://www.clm-tug.com/

- ✅ 首页应显示真实新闻标题（如"全国两会召开：聚焦高质量发展..."）
- ✅ 点击文章查看详细内容
- ✅ 评论区应有真实评论内容

---

## ⚠️ 重要提示

### 管理员账号会重置

播种后管理员账号为：

- 邮箱：`admin@portal.com`
- 密码：`admin123`

**务必登录后立即修改密码！**

### 数据会被清空

播种前会清空所有现有数据：

- 所有文章
- 所有评论
- 所有用户（除了新建的测试用户）
- 所有收藏

如果有重要数据，请先备份！

---

## 🔍 故障排查

### 问题：找不到数据库连接字符串

**解决**：

1. 确保在 Vercel 后端项目中创建了 PostgreSQL 数据库
2. 如果没有，点击 **Storage** → **Create Database** → **PostgreSQL**
3. 创建后会自动生成连接字符串

### 问题：播种失败

**解决**：

```powershell
# 先执行迁移
npx prisma migrate deploy

# 再执行播种
npx prisma db seed
```

### 问题：前端仍显示旧数据

**解决**：

1. 强制刷新浏览器（Ctrl+Shift+R）
2. 清除浏览器缓存
3. 检查后端 API 是否正常：访问 https://portalsite-backend.vercel.app/api/articles

---

## 📊 更新的数据

- **50 篇真实新闻文章**（涵盖时政、社会、国际、军事、财经、体育、娱乐、科技）
- **30 条真实用户评论**
- **高质量 Unsplash 图片**
- **8 个新闻分类**

---

**需要帮助？** 查看详细指南：[VERCEL_UPDATE_DATA.md](VERCEL_UPDATE_DATA.md)
