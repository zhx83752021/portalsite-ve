import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/errorHandler'
import { userService } from '../services/prismaService'

const signToken = (payload: { id: number; email: string; role: string }) => {
    const secret = process.env.JWT_SECRET || 'default-secret'
    return jwt.sign(payload, secret, { expiresIn: '7d' } as jwt.SignOptions)
}

const toSafeUser = <T extends { password?: string }>(u: T) => {
    const { password: _pwd, ...rest } = u
    return rest
}

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body

        if (!username || !email || !password) {
            throw new AppError('请提供完整的注册信息', 400)
        }

        const existing = await userService.getUserByEmail(email)
        if (existing) {
            throw new AppError('该邮箱已被注册', 400)
        }

        const hashedPassword = await bcrypt.hash(password, 10)
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(username)}`

        const created = await userService.createUser({
            username,
            email,
            password: hashedPassword,
            avatar,
            role: 'USER'
        })

        const token = signToken({
            id: created.id,
            email: created.email,
            role: created.role
        })

        res.status(201).json({
            code: 200,
            message: '注册成功',
            data: {
                token,
                userInfo: toSafeUser(created)
            }
        })
    } catch (error) {
        next(error)
    }
}

export const login = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            throw new AppError('请提供邮箱和密码', 400)
        }

        const user = await userService.getUserByEmail(email)
        if (!user) {
            throw new AppError('邮箱或密码错误', 401)
        }

        if (user.status === 0) {
            throw new AppError('账号已被禁用，请联系管理员', 403)
        }

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) {
            throw new AppError('邮箱或密码错误', 401)
        }

        const token = signToken({
            id: user.id,
            email: user.email,
            role: user.role
        })

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                userInfo: toSafeUser(user)
            }
        })
    } catch (error) {
        next(error)
    }
}
