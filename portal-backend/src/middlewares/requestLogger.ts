/**
 * HTTP请求日志中间件
 * 记录每个请求的详细信息和响应时间
 */
import { Request, Response, NextFunction } from 'express'
import { logger, startTimer } from '../utils/logger'

export const requestLogger = (req: Request, res: Response, next: NextFunction) => {
    const timer = startTimer()

    // 记录请求开始
    if (process.env.NODE_ENV === 'development') {
        logger.debug(`收到请求: ${req.method} ${req.path}`, {
            query: req.query,
            body: req.body,
            ip: req.ip
        })
    }

    // 监听响应完成
    res.on('finish', () => {
        const duration = timer()
        logger.http(req.method, req.path, res.statusCode, duration)
    })

    next()
}
