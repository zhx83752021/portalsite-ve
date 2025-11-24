import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/errorHandler'

// 模拟数据库
const users: any[] = []

export const register = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body

        // 验证输入
        if (!username || !email || !password) {
            throw new AppError('请提供完整的注册信息', 400)
        }

        // 检查用户是否已存在
        const existingUser = users.find(u => u.email === email)
        if (existingUser) {
            throw new AppError('该邮箱已被注册', 400)
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10)

        // 创建用户
        const user = {
            id: users.length + 1,
            username,
            email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            role: 'user',
            createdAt: new Date().toISOString()
        }

        users.push(user)

        // 生成JWT
        const secret = process.env.JWT_SECRET || 'default-secret'
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn: '7d' } as jwt.SignOptions
        )

        // 返回用户信息（不包括密码）
        const { password: _, ...userInfo } = user

        res.status(201).json({
            code: 200,
            message: '注册成功',
            data: {
                token,
                userInfo
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

        // 验证输入
        if (!email || !password) {
            throw new AppError('请提供邮箱和密码', 400)
        }

        // 查找用户
        const user = users.find(u => u.email === email)
        if (!user) {
            throw new AppError('邮箱或密码错误', 401)
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, user.password)
        if (!isPasswordValid) {
            throw new AppError('邮箱或密码错误', 401)
        }

        // 生成JWT
        const secret = process.env.JWT_SECRET || 'default-secret'
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            secret,
            { expiresIn: '7d' } as jwt.SignOptions
        )

        // 返回用户信息（不包括密码）
        const { password: _, ...userInfo } = user

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                userInfo
            }
        })
    } catch (error) {
        next(error)
    }
}
