/**
 * 日志管理工具
 * 提供统一的日志记录功能，支持不同级别的日志输出
 */

enum LogLevel {
    ERROR = 0,
    WARN = 1,
    INFO = 2,
    DEBUG = 3
}

class Logger {
    private level: LogLevel
    private isDevelopment: boolean

    constructor() {
        this.isDevelopment = process.env.NODE_ENV !== 'production'
        const envLevel = process.env.LOG_LEVEL?.toLowerCase() || 'info'

        switch (envLevel) {
            case 'error':
                this.level = LogLevel.ERROR
                break
            case 'warn':
                this.level = LogLevel.WARN
                break
            case 'info':
                this.level = LogLevel.INFO
                break
            case 'debug':
                this.level = LogLevel.DEBUG
                break
            default:
                this.level = LogLevel.INFO
        }
    }

    private formatMessage(level: string, message: string, meta?: any): string {
        const timestamp = new Date().toISOString()
        const metaStr = meta ? `\n${JSON.stringify(meta, null, 2)}` : ''
        return `[${timestamp}] [${level}] ${message}${metaStr}`
    }

    /**
     * 错误日志（始终输出）
     */
    error(message: string, error?: Error | any): void {
        if (this.level >= LogLevel.ERROR) {
            const errorInfo = error instanceof Error
                ? { message: error.message, stack: error.stack }
                : error

            console.error('❌', this.formatMessage('ERROR', message, errorInfo))

            // 生产环境可以在这里集成错误监控服务（如Sentry）
            if (!this.isDevelopment) {
                // TODO: 发送到错误监控服务
                // sentry.captureException(error)
            }
        }
    }

    /**
     * 警告日志
     */
    warn(message: string, meta?: any): void {
        if (this.level >= LogLevel.WARN) {
            console.warn('⚠️', this.formatMessage('WARN', message, meta))
        }
    }

    /**
     * 信息日志
     */
    info(message: string, meta?: any): void {
        if (this.level >= LogLevel.INFO) {
            console.log('ℹ️', this.formatMessage('INFO', message, meta))
        }
    }

    /**
     * 调试日志（仅开发环境）
     */
    debug(message: string, meta?: any): void {
        if (this.level >= LogLevel.DEBUG) {
            console.log('🔍', this.formatMessage('DEBUG', message, meta))
        }
    }

    /**
     * HTTP请求日志
     */
    http(method: string, path: string, statusCode: number, duration: number): void {
        if (this.level >= LogLevel.INFO) {
            const emoji = statusCode >= 500 ? '❌' : statusCode >= 400 ? '⚠️' : '✅'
            console.log(
                emoji,
                `[${new Date().toISOString()}] [HTTP] ${method} ${path} - ${statusCode} (${duration}ms)`
            )
        }
    }

    /**
     * 数据库操作日志
     */
    database(operation: string, table: string, duration?: number): void {
        if (this.level >= LogLevel.DEBUG) {
            const durationStr = duration ? ` (${duration}ms)` : ''
            console.log(
                '🗄️',
                `[${new Date().toISOString()}] [DB] ${operation} on ${table}${durationStr}`
            )
        }
    }

    /**
     * 性能监控日志
     */
    performance(label: string, duration: number, threshold: number = 1000): void {
        if (duration > threshold) {
            this.warn(`性能警告: ${label} 耗时 ${duration}ms（阈值: ${threshold}ms）`)
        } else if (this.level >= LogLevel.DEBUG) {
            this.debug(`性能: ${label} 耗时 ${duration}ms`)
        }
    }
}

// 导出单例
export const logger = new Logger()

// 性能计时器辅助函数
export const startTimer = (): (() => number) => {
    const start = Date.now()
    return () => Date.now() - start
}

// 装饰器：记录函数执行时间
export function logExecutionTime(target: any, propertyName: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value

    descriptor.value = async function (...args: any[]) {
        const timer = startTimer()
        try {
            const result = await originalMethod.apply(this, args)
            const duration = timer()
            logger.performance(`${target.constructor.name}.${propertyName}`, duration)
            return result
        } catch (error) {
            const duration = timer()
            logger.error(`${target.constructor.name}.${propertyName} 执行失败 (${duration}ms)`, error)
            throw error
        }
    }

    return descriptor
}
