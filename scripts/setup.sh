#!/bin/bash

# 门户网站快速部署脚本
# 用于快速初始化开发环境

set -e

echo "================================"
echo "🚀 门户网站快速部署脚本"
echo "================================"
echo ""

# 颜色定义
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 检查Node.js版本
echo "📋 检查环境..."
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ 未安装 Node.js${NC}"
    echo "请先安装 Node.js 18.x 或更高版本"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "${RED}❌ Node.js 版本过低 (当前: $(node -v))${NC}"
    echo "需要 Node.js 18.x 或更高版本"
    exit 1
fi

echo -e "${GREEN}✅ Node.js 版本: $(node -v)${NC}"

# 检查PostgreSQL
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}⚠️  未检测到 PostgreSQL，请确保已安装并运行${NC}"
fi

# 安装后端依赖
echo ""
echo "📦 安装后端依赖..."
cd portal-backend
npm install

# 配置后端环境变量
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  配置后端环境变量..."
    cp .env.example .env
    echo -e "${YELLOW}⚠️  请编辑 portal-backend/.env 文件，配置数据库连接${NC}"
    read -p "按回车键继续..."
fi

# 生成Prisma Client
echo ""
echo "🔧 生成 Prisma Client..."
npx prisma generate

# 询问是否运行数据库迁移
echo ""
read -p "是否运行数据库迁移? (y/n) " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo "🗄️  运行数据库迁移..."
    npx prisma migrate dev --name init

    read -p "是否填充测试数据? (y/n) " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        echo "🌱 填充测试数据..."
        npm run db:seed
        echo -e "${GREEN}✅ 测试数据已填充${NC}"
    fi
fi

# 安装前端依赖
echo ""
echo "📦 安装前端依赖..."
cd ../portal-frontend
npm install

# 配置前端环境变量
if [ ! -f .env ]; then
    echo ""
    echo "⚙️  配置前端环境变量..."
    cp .env.example .env 2>/dev/null || cat > .env << EOF
# API Base URL
VITE_API_BASE_URL=/api

# App Title
VITE_APP_TITLE=门户网站
EOF
fi

cd ..

echo ""
echo "================================"
echo -e "${GREEN}✅ 部署完成！${NC}"
echo "================================"
echo ""
echo "📝 下一步："
echo "1. 启动后端: cd portal-backend && npm run dev"
echo "2. 启动前端: cd portal-frontend && npm run dev"
echo ""
echo "🌐 访问地址："
echo "- 前端: http://localhost:5173"
echo "- 后端: http://localhost:3000"
echo "- 健康检查: http://localhost:3000/health"
echo ""
echo "👤 默认管理员账号："
echo "- 邮箱: admin@portal.com"
echo "- 密码: admin123"
echo ""
