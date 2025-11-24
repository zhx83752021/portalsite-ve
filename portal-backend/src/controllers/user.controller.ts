import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middlewares/auth'
import { AppError } from '../middlewares/errorHandler'

export const getUserInfo = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        // 从JWT中获取用户信息
        const user = req.user

        if (!user) {
            throw new AppError('未找到用户信息', 404)
        }

        res.json({
            code: 200,
            message: 'success',
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export const updateUserInfo = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const user = req.user
        const { username } = req.body

        if (!user) {
            throw new AppError('未找到用户信息', 404)
        }

        // 更新用户信息（这里只是模拟）
        const updatedUser = {
            ...user,
            username: username || user.email
        }

        res.json({
            code: 200,
            message: '更新成功',
            data: updatedUser
        })
    } catch (error) {
        next(error)
    }
}
