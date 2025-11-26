import express, { Express, Request, Response } from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import dotenv from 'dotenv'
import { errorHandler } from './middlewares/errorHandler'
import { rateLimiter } from './middlewares/rateLimiter'
import { requestLogger } from './middlewares/requestLogger'
import { logger } from './utils/logger'
import routes from './routes'

// 加载环境变量
dotenv.config()

const app: Express = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'development'

// 中间件
app.use(helmet()) // 安全头

// CORS配置 - 将逗号分隔的字符串转换为数组
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(origin => origin.trim())
    : '*'

app.use(cors({
    origin: allowedOrigins,
    credentials: true
})) // CORS
app.use(compression()) // 压缩

// 根据环境选择日志中间件
if (NODE_ENV === 'production') {
    app.use(morgan('combined')) // 生产环境使用详细日志
} else {
    app.use(morgan('dev')) // 开发环境使用简洁日志
}

app.use(requestLogger) // 自定义请求日志
app.use(express.json()) // JSON解析
app.use(express.urlencoded({ extended: true })) // URL编码解析

// 速率限制
app.use(rateLimiter)

// 健康检查
app.get('/health', (req: Request, res: Response) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    })
})

// API路由
app.use('/api', routes)

// 404处理
app.use((req: Request, res: Response) => {
    res.status(404).json({
        code: 404,
        message: '接口不存在',
        path: req.path
    })
})

// 错误处理
app.use(errorHandler)

export default app
