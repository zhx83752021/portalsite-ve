/**
 * Prisma数据库客户端配置
 */
import { PrismaClient } from '@prisma/client'

// 创建Prisma Client单例
const prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
})

// 优雅关闭
process.on('beforeExit', async () => {
    await prisma.$disconnect()
})

export { prisma }
