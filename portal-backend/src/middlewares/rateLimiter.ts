import rateLimit from 'express-rate-limit'

export const rateLimiter = rateLimit({
    windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15分钟
    max: Number(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // 限制100个请求
    message: {
        code: 429,
        message: '请求过于频繁，请稍后再试'
    },
    standardHeaders: true,
    legacyHeaders: false
})
