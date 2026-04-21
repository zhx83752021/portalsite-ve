import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/errorHandler'
import { AuthRequest } from '../middlewares/auth'
import { prisma } from '../config/database'

const JWT_SECRET = process.env.JWT_SECRET || 'default-secret'

function toAdminInfo(user: {
    id: number
    username: string
    email: string
    avatar: string | null
    role: string
    createdAt: Date
}) {
    return {
        id: user.id,
        username: user.username,
        email: user.email,
        avatar: user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        role: 'admin',
        createdAt: user.createdAt.toISOString()
    }
}

/**
 * 管理员登录（Prisma users 表中 role = ADMIN）
 */
export const adminLogin = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            throw new AppError('请提供邮箱和密码', 400)
        }

        const user = await prisma.user.findFirst({
            where: { email, role: 'ADMIN', status: 1 }
        })
        if (!user) {
            throw new AppError('邮箱或密码错误', 401)
        }

        const ok = await bcrypt.compare(password, user.password)
        if (!ok) {
            throw new AppError('邮箱或密码错误', 401)
        }

        const token = jwt.sign(
            { id: user.id, email: user.email, role: 'admin', isAdmin: true },
            JWT_SECRET,
            { expiresIn: '7d' } as jwt.SignOptions
        )

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                adminInfo: toAdminInfo(user)
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getAdminInfo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id
        if (!adminId) throw new AppError('未认证', 401)

        const user = await prisma.user.findUnique({ where: { id: adminId } })
        if (!user || user.role !== 'ADMIN') {
            throw new AppError('管理员不存在', 404)
        }

        res.json({
            code: 200,
            message: '获取成功',
            data: toAdminInfo(user)
        })
    } catch (error) {
        next(error)
    }
}

export const updateAdminPassword = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const adminId = req.user?.id
        if (!adminId) throw new AppError('未认证', 401)

        const { oldPassword, newPassword } = req.body
        if (!oldPassword || !newPassword) {
            throw new AppError('请提供旧密码和新密码', 400)
        }
        if (newPassword.length < 6) {
            throw new AppError('新密码长度不能小于6位', 400)
        }

        const user = await prisma.user.findUnique({ where: { id: adminId } })
        if (!user || user.role !== 'ADMIN') {
            throw new AppError('管理员不存在', 404)
        }

        const valid = await bcrypt.compare(oldPassword, user.password)
        if (!valid) throw new AppError('旧密码错误', 401)

        await prisma.user.update({
            where: { id: adminId },
            data: { password: await bcrypt.hash(newPassword, 10) }
        })

        res.json({ code: 200, message: '密码修改成功', data: null })
    } catch (error) {
        next(error)
    }
}

export const createAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body
        if (!username || !email || !password) {
            throw new AppError('请提供完整的管理员信息', 400)
        }

        const dup = await prisma.user.findFirst({
            where: { OR: [{ email }, { username }] }
        })
        if (dup) {
            throw new AppError('用户名或邮箱已存在', 400)
        }

        const hashed = await bcrypt.hash(password, 10)
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashed,
                role: 'ADMIN',
                status: 1
            }
        })

        res.status(201).json({
            code: 200,
            message: '管理员创建成功',
            data: toAdminInfo(user)
        })
    } catch (error) {
        next(error)
    }
}

export const getAdminList = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const list = await prisma.user.findMany({
            where: { role: 'ADMIN' },
            orderBy: { id: 'asc' },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true
            }
        })

        const admins = list.map(u => ({
            id: u.id,
            username: u.username,
            email: u.email,
            avatar: u.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
            role: 'admin',
            createdAt: u.createdAt.toISOString()
        }))

        res.json({
            code: 200,
            message: '获取成功',
            data: {
                list: admins,
                total: admins.length
            }
        })
    } catch (error) {
        next(error)
    }
}

export const deleteAdmin = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const currentId = req.user?.id
        const targetId = parseInt(req.params.id, 10)
        if (!currentId) throw new AppError('未认证', 401)
        if (currentId === targetId) {
            throw new AppError('不能删除自己的账号', 400)
        }
        if (targetId === 1) {
            throw new AppError('不能删除主管理员账号', 400)
        }

        const victim = await prisma.user.findUnique({ where: { id: targetId } })
        if (!victim || victim.role !== 'ADMIN') {
            throw new AppError('管理员不存在', 404)
        }

        await prisma.user.delete({ where: { id: targetId } })

        res.json({ code: 200, message: '删除成功', data: null })
    } catch (error) {
        next(error)
    }
}
