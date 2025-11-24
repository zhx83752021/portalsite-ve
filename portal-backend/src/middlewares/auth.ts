import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { AppError } from './errorHandler'

export interface AuthRequest extends Request {
    user?: {
        id: number
        email: string
        role: string
        isAdmin?: boolean
    }
}

export const authMiddleware = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')

        if (!token) {
            throw new AppError('未提供认证令牌', 401)
        }

        const secret = process.env.JWT_SECRET || 'default-secret'
        const decoded = jwt.verify(token, secret) as any

        req.user = {
            id: decoded.id,
            email: decoded.email,
            role: decoded.role
        }

        next()
    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            next(new AppError('无效的认证令牌', 401))
        } else if (error instanceof jwt.TokenExpiredError) {
            next(new AppError('认证令牌已过期', 401))
        } else {
            next(error)
        }
    }
}

export const optionalAuth = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.headers.authorization?.replace('Bearer ', '')

        if (token) {
            const secret = process.env.JWT_SECRET || 'default-secret'
            const decoded = jwt.verify(token, secret) as any

            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            }
        }

        next()
    } catch (error) {
        // 可选认证失败不抛出错误
        next()
    }
}

// 导出authenticateToken作为authMiddleware的别名，保持兼容性
export const authenticateToken = authMiddleware
