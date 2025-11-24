# 🚀 部署指南

本文档提供详细的部署步骤和最佳实践，帮助您将门户网站部署到生产环境。

---

## 📋 目录

- [环境要求](#环境要求)
- [部署前准备](#部署前准备)
- [Docker 部署](#docker-部署推荐)
- [Vercel 部署](#vercel-部署)
- [传统部署（VPS/云服务器）](#传统部署)
- [数据库配置](#数据库配置)
- [环境变量配置](#环境变量配置)
- [安全配置](#安全配置)
- [性能优化](#性能优化)
- [监控和维护](#监控和维护)
- [故障排查](#故障排查)

---

## 环境要求

### 最低配置
- **Node.js**: >= 18.0.0
- **npm**: >= 8.0.0
- **PostgreSQL**: >= 15.0
- **内存**: 最少 1GB RAM
- **存储**: 最少 10GB 可用空间

### 推荐配置
- **Node.js**: 18.x LTS
- **PostgreSQL**: 15.x
- **内存**: 2GB+ RAM
- **存储**: 20GB+ SSD

---

## 部署前准备

### 1. 代码检查清单

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
cd portal-backend && npm install
cd ../portal-frontend && npm install

# 3. 运行类型检查
npm run build  # 在两个目录分别执行

# 4. 运行测试（如果有）
npm test
```

### 2. 环境变量准备

**后端环境变量** (`.env` 或 `.env.production`)：
```bash
# 必填项
DATABASE_URL="postgresql://user:password@host:5432/dbname?schema=public"
JWT_SECRET="your-super-secret-key-minimum-32-characters"

# 推荐配置
NODE_ENV=production
PORT=3000
CORS_ORIGIN=https://your-frontend-domain.com
RATE_LIMIT_MAX_REQUESTS=100
```

**前端环境变量** (`.env.production`)：
```bash
VITE_API_BASE_URL=https://your-api-domain.com/api
VITE_APP_TITLE=门户网站
```

### 3. 生成强密钥

```bash
# 生成JWT密钥
openssl rand -base64 64

# 或使用Node.js
node -e "console.log(require('crypto').randomBytes(64).toString('base64'))"
```

---

## Docker 部署（推荐）

### 优势
- ✅ 环境一致性
- ✅ 快速部署
- ✅ 易于扩展
- ✅ 自动健康检查

### 部署步骤

#### 1. 准备环境变量

```bash
# 复制环境变量模板
cp .env.docker .env

# 编辑 .env 文件，填写真实配置
nano .env
```

必须修改的配置项：
- `POSTGRES_PASSWORD`: 数据库密码
- `JWT_SECRET`: JWT密钥
- `CORS_ORIGIN`: 前端域名

#### 2. 启动服务

```bash
# 构建并启动所有服务
docker-compose up -d

# 查看服务状态
docker-compose ps

# 查看日志
docker-compose logs -f
```

#### 3. 初始化数据库

```bash
# 运行数据库迁移
docker-compose exec backend npx prisma migrate deploy

# （可选）填充测试数据
docker-compose exec backend npm run db:seed
```

#### 4. 验证部署

访问以下地址验证：
- 前端: `http://localhost`
- 后端: `http://localhost:3000/health`
- 数据库: `localhost:5432`

#### 5. 常用命令

```bash
# 停止所有服务
docker-compose down

# 停止并删除数据卷（⚠️ 会清空数据库）
docker-compose down -v

# 重启特定服务
docker-compose restart backend

# 查看服务日志
docker-compose logs backend -f

# 进入容器
docker-compose exec backend sh
```

### 生产环境优化

#### docker-compose.prod.yml
```yaml
version: '3.8'
services:
  backend:
    restart: always
    deploy:
      resources:
        limits:
          cpus: '1.0'
          memory: 1G
    logging:
      driver: "json-file"
      options:
        max-size: "10m"
        max-file: "3"
```

使用生产配置：
```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

---

## Vercel 部署

### 前端部署到 Vercel

#### 1. 安装 Vercel CLI

```bash
npm install -g vercel
```

#### 2. 部署前端

```bash
cd portal-frontend

# 登录 Vercel
vercel login

# 部署
vercel --prod
```

#### 3. 配置环境变量

在 Vercel Dashboard 中设置：
- `VITE_API_BASE_URL`: 后端API地址

### 后端部署选项

⚠️ **注意**: Vercel Serverless 不适合长连接和数据库密集型应用。

**推荐方案**:
1. 使用 Railway/Render 部署后端
2. 使用 DigitalOcean App Platform
3. 使用 AWS ECS/Fargate

---

## 传统部署

### 使用 PM2（推荐用于 VPS/云服务器）

#### 1. 安装 PM2

```bash
npm install -g pm2
```

#### 2. 构建应用

**后端**:
```bash
cd portal-backend
npm install --production
npm run build
```

**前端**:
```bash
cd portal-frontend
npm install
npm run build
```

#### 3. 启动后端服务

创建 `ecosystem.config.js`:
```javascript
module.exports = {
  apps: [{
    name: 'portal-backend',
    script: './dist/app.js',
    instances: 2,
    exec_mode: 'cluster',
    env_production: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
    max_memory_restart: '1G'
  }]
}
```

启动：
```bash
pm2 start ecosystem.config.js --env production
pm2 save
pm2 startup
```

#### 4. 配置 Nginx

```nginx
# /etc/nginx/sites-available/portal

# 后端API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# 前端
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    root /var/www/portal-frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://localhost:3000;
        # ... 同上
    }
}
```

启用站点：
```bash
sudo ln -s /etc/nginx/sites-available/portal /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

#### 5. 配置 SSL（使用 Let's Encrypt）

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com
```

---

## 数据库配置

### PostgreSQL 安装

#### Ubuntu/Debian
```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

#### macOS
```bash
brew install postgresql@15
brew services start postgresql@15
```

### 创建数据库和用户

```sql
-- 连接到 PostgreSQL
sudo -u postgres psql

-- 创建数据库
CREATE DATABASE portal_db;

-- 创建用户
CREATE USER portal_user WITH ENCRYPTED PASSWORD 'secure_password_here';

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE portal_db TO portal_user;

-- 退出
\q
```

### 数据库迁移

```bash
cd portal-backend

# 生成 Prisma Client
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# （可选）填充测试数据
npm run db:seed
```

### 数据库备份

```bash
# 备份
pg_dump -U portal_user -d portal_db -F c -f backup_$(date +%Y%m%d).dump

# 恢复
pg_restore -U portal_user -d portal_db backup_20240101.dump
```

---

## 环境变量配置

### 后端环境变量详解

| 变量名 | 必需 | 默认值 | 说明 |
|--------|------|--------|------|
| `NODE_ENV` | ✅ | development | 运行环境 (production/development) |
| `PORT` | ❌ | 3000 | 服务端口 |
| `DATABASE_URL` | ✅ | - | PostgreSQL连接字符串 |
| `JWT_SECRET` | ✅ | - | JWT密钥（至少32字符） |
| `JWT_EXPIRES_IN` | ❌ | 7d | Token过期时间 |
| `CORS_ORIGIN` | ✅ | * | 允许的前端域名 |
| `BCRYPT_ROUNDS` | ❌ | 10 | BCrypt加密强度 (10-12) |
| `RATE_LIMIT_WINDOW_MS` | ❌ | 900000 | 速率限制时间窗口 |
| `RATE_LIMIT_MAX_REQUESTS` | ❌ | 100 | 最大请求次数 |
| `LOG_LEVEL` | ❌ | info | 日志级别 (error/warn/info/debug) |

### 前端环境变量详解

| 变量名 | 必需 | 说明 |
|--------|------|------|
| `VITE_API_BASE_URL` | ✅ | 后端API地址 |
| `VITE_APP_TITLE` | ❌ | 应用标题 |

---

## 安全配置

### 1. 密钥管理

❌ **不要做**:
- 将密钥硬编码在代码中
- 提交包含真实密钥的 `.env` 到 Git
- 使用弱密钥（如 "123456"）

✅ **应该做**:
- 使用强随机密钥（至少32字符）
- 使用环境变量或密钥管理服务
- 定期轮换密钥
- 不同环境使用不同密钥

### 2. HTTPS 配置

生产环境**必须**使用 HTTPS：
```bash
# 使用 Let's Encrypt 免费证书
sudo certbot --nginx -d yourdomain.com
```

### 3. 数据库安全

- 使用强密码
- 限制数据库访问IP
- 启用 SSL 连接
- 定期备份

### 4. 防火墙配置

```bash
# UFW 示例
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

---

## 性能优化

### 1. 前端优化

```typescript
// vite.config.ts 已配置
{
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'vue-vendor': ['vue', 'vue-router', 'pinia'],
          'element-plus': ['element-plus']
        }
      }
    }
  }
}
```

### 2. 后端优化

- 启用 Gzip 压缩 ✅（已配置）
- 使用连接池
- 添加 Redis 缓存层（可选）
- 启用 CDN 加速静态资源

### 3. 数据库优化

```sql
-- 添加索引（已在 Prisma Schema 中配置）
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_created ON articles(created_at);
```

### 4. Nginx 缓存

```nginx
# 静态资源缓存
location ~* \.(jpg|jpeg|png|gif|ico|css|js)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 监控和维护

### 1. 健康检查

```bash
# 后端健康检查
curl http://localhost:3000/health

# 预期响应
{
  "status": "ok",
  "timestamp": "2024-11-24T10:00:00.000Z",
  "uptime": 12345
}
```

### 2. 日志管理

日志位置：
- PM2 日志: `~/.pm2/logs/`
- Docker 日志: `docker-compose logs`
- Nginx 日志: `/var/log/nginx/`

查看日志：
```bash
# PM2
pm2 logs portal-backend

# Docker
docker-compose logs -f backend

# Nginx
sudo tail -f /var/log/nginx/access.log
```

### 3. 性能监控

推荐工具：
- **New Relic** - 应用性能监控
- **Datadog** - 全栈监控
- **Sentry** - 错误追踪
- **Google Analytics** - 用户行为分析

### 4. 定期维护任务

```bash
# 每周备份数据库
0 2 * * 0 /usr/local/bin/backup-db.sh

# 每月清理日志
0 3 1 * * find /var/log -name "*.log" -mtime +30 -delete

# 每天检查磁盘空间
0 9 * * * df -h | mail -s "Disk Usage Report" admin@example.com
```

---

## 故障排查

### 常见问题

#### 1. 数据库连接失败

**错误**: `Can't reach database server`

**解决**:
```bash
# 检查 PostgreSQL 是否运行
sudo systemctl status postgresql

# 检查连接字符串
echo $DATABASE_URL

# 测试连接
psql $DATABASE_URL
```

#### 2. 端口被占用

**错误**: `Port 3000 is already in use`

**解决**:
```bash
# 查找占用进程
lsof -i :3000

# 杀死进程
kill -9 <PID>
```

#### 3. CORS 错误

**错误**: `Access to fetch has been blocked by CORS policy`

**解决**:
- 检查 `CORS_ORIGIN` 环境变量
- 确保前端域名已添加到白名单
- 检查协议（http vs https）

#### 4. 内存不足

**症状**: 应用崩溃，OOM 错误

**解决**:
```bash
# 增加 Node.js 内存限制
NODE_OPTIONS="--max-old-space-size=2048" node dist/app.js

# 或在 PM2 配置中
max_memory_restart: '2G'
```

### 日志分析

```bash
# 查找错误
grep -i "error" /var/log/app.log

# 统计请求量
awk '{print $1}' /var/log/nginx/access.log | sort | uniq -c | sort -nr | head -10

# 查找慢请求
grep "duration" logs/app.log | awk '$NF > 1000'
```

---

## 部署检查清单

部署前确认：

- [ ] 所有环境变量已配置
- [ ] 数据库已创建和迁移
- [ ] JWT 密钥已生成并配置
- [ ] CORS 已正确配置
- [ ] HTTPS 已启用（生产环境）
- [ ] 防火墙已配置
- [ ] 备份策略已制定
- [ ] 监控已配置
- [ ] 日志轮转已配置
- [ ] 健康检查端点正常
- [ ] 性能测试通过
- [ ] 安全扫描完成

---

## 更新和回滚

### 平滑更新

```bash
# 1. 拉取最新代码
git pull origin main

# 2. 安装依赖
npm install

# 3. 运行迁移
npx prisma migrate deploy

# 4. 构建
npm run build

# 5. 重启服务（零停机）
pm2 reload ecosystem.config.js
```

### 回滚

```bash
# Git 回滚
git reset --hard <commit-hash>

# 数据库回滚
npx prisma migrate resolve --rolled-back <migration-name>

# 重启服务
pm2 restart all
```

---

## 扩展阅读

- [Prisma 最佳实践](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Node.js 生产环境最佳实践](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [PostgreSQL 性能调优](https://wiki.postgresql.org/wiki/Performance_Optimization)
- [Nginx 优化指南](https://www.nginx.com/blog/tuning-nginx/)

---

## 获取帮助

如有问题，请：
1. 查看日志文件
2. 检查环境变量配置
3. 参考故障排查章节
4. 提交 Issue 到项目仓库

---

**📝 文档版本**: v1.0
**📅 更新日期**: 2024-11-24
**👤 维护者**: Portal Team
