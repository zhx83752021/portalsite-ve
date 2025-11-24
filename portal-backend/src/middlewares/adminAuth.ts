import { Response, NextFunction } from 'express'
import { AuthRequest } from './auth'
import { AppError } from './errorHandler'

/**
 * 管理员权限验证中间件
 * 必须在 authenticateToken 中间件之后使用
 */
export const requireAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 检查用户是否已通过身份验证
        if (!req.user) {
            throw new AppError('未认证', 401)
        }

        // 检查用户是否为管理员
        if (req.user.role !== 'admin') {
            throw new AppError('需要管理员权限', 403)
        }

        next()
    } catch (error) {
        next(error)
    }
}

/**
 * 超级管理员权限验证中间件
 * 仅允许ID为1的管理员访问
 */
export const requireSuperAdmin = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 检查用户是否已通过身份验证
        if (!req.user) {
            throw new AppError('未认证', 401)
        }

        // 检查用户是否为管理员
        if (req.user.role !== 'admin') {
            throw new AppError('需要管理员权限', 403)
        }

        // 检查是否为超级管理员（ID为1）
        if (req.user.id !== 1) {
            throw new AppError('需要超级管理员权限', 403)
        }

        next()
    } catch (error) {
        next(error)
    }
}
