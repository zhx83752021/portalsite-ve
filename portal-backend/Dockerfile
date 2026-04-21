# 多阶段构建
# 阶段1: 构建（需要完整依赖，包含 TypeScript、Prisma CLI 等）
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma/

# 安装全部依赖（含 devDependencies）
RUN npm ci

# 复制源代码并构建
COPY . .
RUN npx prisma generate
RUN npm run build

# 阶段2: 生产运行（只保留运行时所需）
FROM node:20-alpine

WORKDIR /app
ENV NODE_ENV=production

COPY package*.json ./
COPY prisma ./prisma/

# 仅装生产依赖；--ignore-scripts 跳过 postinstall 里的 `prisma generate`
# （prisma CLI 在 devDeps，生产镜像不装；生成好的 client 从 builder 拷过来）
RUN npm ci --omit=dev --ignore-scripts && npm cache clean --force

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/server.js"]
