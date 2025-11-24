# 门户网站快速部署脚本 (Windows PowerShell)
# 用于快速初始化开发环境

Write-Host "================================" -ForegroundColor Cyan
Write-Host "🚀 门户网站快速部署脚本" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan
Write-Host ""

# 检查Node.js版本
Write-Host "📋 检查环境..." -ForegroundColor Yellow
try {
    $nodeVersion = node -v
    Write-Host "✅ Node.js 版本: $nodeVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ 未安装 Node.js" -ForegroundColor Red
    Write-Host "请先安装 Node.js 18.x 或更高版本" -ForegroundColor Red
    exit 1
}

# 检查PostgreSQL
try {
    $null = Get-Command psql -ErrorAction Stop
    Write-Host "✅ PostgreSQL 已安装" -ForegroundColor Green
} catch {
    Write-Host "⚠️  未检测到 PostgreSQL，请确保已安装并运行" -ForegroundColor Yellow
}

# 安装后端依赖
Write-Host ""
Write-Host "📦 安装后端依赖..." -ForegroundColor Yellow
Set-Location portal-backend
npm install

# 配置后端环境变量
if (-not (Test-Path .env)) {
    Write-Host ""
    Write-Host "⚙️  配置后端环境变量..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "⚠️  请编辑 portal-backend\.env 文件，配置数据库连接" -ForegroundColor Yellow
    Read-Host "按回车键继续"
}

# 生成Prisma Client
Write-Host ""
Write-Host "🔧 生成 Prisma Client..." -ForegroundColor Yellow
npx prisma generate

# 询问是否运行数据库迁移
Write-Host ""
$runMigration = Read-Host "是否运行数据库迁移? (y/n)"
if ($runMigration -eq 'y' -or $runMigration -eq 'Y') {
    Write-Host "🗄️  运行数据库迁移..." -ForegroundColor Yellow
    npx prisma migrate dev --name init

    $seedData = Read-Host "是否填充测试数据? (y/n)"
    if ($seedData -eq 'y' -or $seedData -eq 'Y') {
        Write-Host "🌱 填充测试数据..." -ForegroundColor Yellow
        npm run db:seed
        Write-Host "✅ 测试数据已填充" -ForegroundColor Green
    }
}

# 安装前端依赖
Write-Host ""
Write-Host "📦 安装前端依赖..." -ForegroundColor Yellow
Set-Location ..\portal-frontend
npm install

# 配置前端环境变量
if (-not (Test-Path .env)) {
    Write-Host ""
    Write-Host "⚙️  配置前端环境变量..." -ForegroundColor Yellow
    @"
# API Base URL
VITE_API_BASE_URL=/api

# App Title
VITE_APP_TITLE=门户网站
"@ | Out-File -FilePath .env -Encoding utf8
}

Set-Location ..

Write-Host ""
Write-Host "================================" -ForegroundColor Green
Write-Host "✅ 部署完成！" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host ""
Write-Host "📝 下一步：" -ForegroundColor Cyan
Write-Host "1. 启动后端: cd portal-backend; npm run dev"
Write-Host "2. 启动前端: cd portal-frontend; npm run dev"
Write-Host ""
Write-Host "🌐 访问地址：" -ForegroundColor Cyan
Write-Host "- 前端: http://localhost:5173"
Write-Host "- 后端: http://localhost:3000"
Write-Host "- 健康检查: http://localhost:3000/health"
Write-Host ""
Write-Host "👤 默认管理员账号：" -ForegroundColor Cyan
Write-Host "- 邮箱: admin@portal.com"
Write-Host "- 密码: admin123"
Write-Host ""
