import app from './app'
import { logger } from './utils/logger'
import dotenv from 'dotenv'

// 加载环境变量
dotenv.config()

const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

// 启动服务器
app.listen(PORT, () => {
    logger.info('='.repeat(50))
    logger.info('🚀 服务器启动成功！')
    logger.info(`📍 地址: http://localhost:${PORT}`)
    logger.info(`📝 环境: ${NODE_ENV}`)
    logger.info(`🗄️  数据库: ${process.env.DATABASE_URL ? '已连接' : '未配置'}`)
    logger.info(`🔐 JWT: ${process.env.JWT_SECRET ? '已配置' : '未配置'}`)
    logger.info(`🌐 CORS: ${process.env.CORS_ORIGIN || '*'}`)
    logger.info(`⏱️  速率限制: ${process.env.RATE_LIMIT_MAX_REQUESTS || 100}次/${(Number(process.env.RATE_LIMIT_WINDOW_MS) || 900000) / 60000}分钟`)
    logger.info('='.repeat(50))
})
