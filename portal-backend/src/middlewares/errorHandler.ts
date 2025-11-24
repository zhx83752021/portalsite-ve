import { Request, Response, NextFunction } from 'express'
import { logger } from '../utils/logger'

export class AppError extends Error {
    statusCode: number
    isOperational: boolean

    constructor(message: string, statusCode: number = 500) {
        super(message)
        this.statusCode = statusCode
        this.isOperational = true

        Error.captureStackTrace(this, this.constructor)
    }
}

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    let statusCode = 500
    let message = '服务器内部错误'

    if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    }

    // 记录错误日志
    if (statusCode === 500) {
        logger.error(`服务器错误 [${req.method} ${req.path}]`, {
            error: err,
            body: req.body,
            query: req.query,
            params: req.params
        })
    } else if (statusCode >= 400) {
        logger.warn(`请求错误 [${req.method} ${req.path}] - ${statusCode}: ${message}`)
    }

    res.status(statusCode).json({
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    })
}
