# 🔐 安全策略

## 报告安全漏洞

我们非常重视项目的安全性。如果您发现了安全漏洞，请**不要**公开披露。

### 报告流程

1. **通过私密渠道报告**
   - 发送邮件至: security@example.com（请替换为实际邮箱）
   - 或通过 GitHub Security Advisory 提交

2. **提供详细信息**
   - 漏洞描述
   - 重现步骤
   - 影响范围
   - 可能的修复方案（如有）

3. **等待响应**
   - 我们将在48小时内确认收到
   - 7天内提供初步评估
   - 30天内发布修复（根据严重程度）

### 安全响应承诺

- ✅ 及时响应安全报告
- ✅ 保护报告者信息
- ✅ 快速修复漏洞
- ✅ 发布安全公告

---

## 安全最佳实践

### 1. 环境变量安全

❌ **禁止**:
```javascript
// 不要硬编码密钥
const JWT_SECRET = "123456"
```

✅ **推荐**:
```javascript
// 使用环境变量
const JWT_SECRET = process.env.JWT_SECRET
if (!JWT_SECRET) {
  throw new Error('JWT_SECRET 未配置')
}
```

### 2. 密码安全

- ✅ 使用 bcrypt 加密（已实现）
- ✅ 加密强度至少 10 轮（已配置）
- ✅ 不记录明文密码
- ✅ 强制使用强密码策略

### 3. JWT 安全

- ✅ 使用强密钥（至少32字符）
- ✅ 设置合理的过期时间
- ✅ 在服务端验证 Token
- ⚠️ 考虑实现 Token 刷新机制
- ⚠️ 考虑实现 Token 黑名单

### 4. 数据库安全

- ✅ 使用 Prisma ORM（防止 SQL 注入）
- ✅ 参数化查询
- ✅ 最小权限原则
- ✅ 定期备份
- ⚠️ 建议启用 SSL 连接

### 5. API 安全

- ✅ CORS 配置（已实现）
- ✅ 速率限制（已实现）
- ✅ Helmet 安全头（已实现）
- ✅ 输入验证
- ✅ 输出转义

### 6. 文件上传安全

⚠️ **当前未实现文件上传功能**

如需实现，请注意：
- 限制文件类型
- 限制文件大小
- 扫描恶意软件
- 不直接执行上传文件
- 使用随机文件名

### 7. XSS 防护

- ✅ Vue 自动转义（默认）
- ✅ Content-Security-Policy 头（已配置）
- ⚠️ 使用 v-html 时需特别注意

### 8. CSRF 防护

⚠️ **建议实现 CSRF Token**

```typescript
// 示例：添加 CSRF 中间件
import csrf from 'csurf'
app.use(csrf({ cookie: true }))
```

---

## 依赖安全

### 定期检查依赖漏洞

```bash
# 检查后端依赖
cd portal-backend
npm audit

# 自动修复
npm audit fix

# 检查前端依赖
cd portal-frontend
npm audit
npm audit fix
```

### 更新依赖

```bash
# 查看过期依赖
npm outdated

# 更新依赖
npm update

# 更新到最新版本（谨慎）
npm install package@latest
```

---

## 生产环境安全检查清单

### 应用配置

- [ ] NODE_ENV 设置为 production
- [ ] 使用强 JWT 密钥（至少32字符）
- [ ] 数据库使用强密码
- [ ] 禁用调试模式
- [ ] 错误信息不暴露敏感数据
- [ ] 日志不记录敏感信息

### 网络安全

- [ ] 启用 HTTPS
- [ ] 配置正确的 CORS
- [ ] 启用防火墙
- [ ] 限制数据库访问 IP
- [ ] 使用安全的 Cookie 配置

### 服务器安全

- [ ] 定期更新系统补丁
- [ ] 使用非 root 用户运行应用
- [ ] 配置 fail2ban 防止暴力破解
- [ ] 限制 SSH 访问
- [ ] 配置自动备份

### 监控和审计

- [ ] 配置错误监控
- [ ] 配置访问日志
- [ ] 配置异常告警
- [ ] 定期审查日志
- [ ] 配置安全事件通知

---

## 已知限制

当前版本的已知安全限制：

1. **未实现 CSRF 防护** - 建议在表单提交时添加
2. **未实现双因素认证** - 高安全需求建议添加
3. **未实现 Token 刷新机制** - 长期运行建议实现
4. **未实现账户锁定** - 防止暴力破解建议添加
5. **未实现审计日志** - 合规需求建议添加

---

## 安全更新

查看安全更新：
- GitHub Security Advisories
- 项目 CHANGELOG
- npm security advisories

---

## 合规性

### GDPR（如适用）

- 实现数据删除功能
- 提供数据导出功能
- 添加隐私政策
- 实现用户同意机制

### OWASP Top 10

项目已针对 OWASP Top 10 进行防护：

1. ✅ 注入攻击 - Prisma ORM 防护
2. ✅ 身份验证失效 - JWT + bcrypt
3. ⚠️ 敏感数据暴露 - 建议启用 HTTPS
4. ✅ XML 外部实体 - 未使用 XML
5. ⚠️ 失效的访问控制 - 部分实现
6. ✅ 安全配置错误 - Helmet + 环境变量
7. ✅ 跨站脚本 - Vue 自动转义
8. ⚠️ 不安全的反序列化 - 需审查
9. ✅ 使用含有已知漏洞的组件 - npm audit
10. ✅ 日志和监控不足 - 已实现基础日志

---

## 联系方式

- **安全问题**: security@example.com
- **一般问题**: support@example.com
- **GitHub Issues**: [项目仓库](https://github.com/your-repo)

---

**📝 最后更新**: 2024-11-24
**🔒 安全等级**: 中等（适合一般应用）
