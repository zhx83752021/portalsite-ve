import { Request, Response, NextFunction } from 'express'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { AppError } from '../middlewares/errorHandler'

// 模拟管理员数据库
const admins: any[] = [
    {
        id: 1,
        username: 'admin',
        email: 'admin@portal.com',
        password: '', // 将在初始化时设置
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
        role: 'admin',
        createdAt: new Date().toISOString()
    }
]

// 初始化默认管理员密码 (admin123)
const initAdminPassword = async () => {
    if (admins[0].password === '') {
        admins[0].password = await bcrypt.hash('admin123', 10)
        console.log('默认管理员账号已初始化:')
        console.log('用户名: admin@portal.com')
        console.log('密码: admin123')
    }
}

// 立即初始化
initAdminPassword()

/**
 * 管理员登录
 */
export const adminLogin = async (
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

        // 查找管理员
        const admin = admins.find(a => a.email === email)
        if (!admin) {
            throw new AppError('邮箱或密码错误', 401)
        }

        // 验证密码
        const isPasswordValid = await bcrypt.compare(password, admin.password)
        if (!isPasswordValid) {
            throw new AppError('邮箱或密码错误', 401)
        }

        // 生成JWT (管理员token有效期为1天)
        const secret = process.env.JWT_SECRET || 'default-secret'
        const token = jwt.sign(
            {
                id: admin.id,
                email: admin.email,
                role: admin.role,
                isAdmin: true
            },
            secret,
            { expiresIn: '1d' } as jwt.SignOptions
        )

        // 返回管理员信息（不包括密码）
        const { password: _, ...adminInfo } = admin

        res.json({
            code: 200,
            message: '登录成功',
            data: {
                token,
                adminInfo
            }
        })
    } catch (error) {
        next(error)
    }
}

/**
 * 获取管理员信息
 */
export const getAdminInfo = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminId = (req as any).user?.id

        const admin = admins.find(a => a.id === adminId)
        if (!admin) {
            throw new AppError('管理员不存在', 404)
        }

        const { password: _, ...adminInfo } = admin

        res.json({
            code: 200,
            message: '获取成功',
            data: adminInfo
        })
    } catch (error) {
        next(error)
    }
}

/**
 * 修改管理员密码
 */
export const updateAdminPassword = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminId = (req as any).user?.id
        const { oldPassword, newPassword } = req.body

        // 验证输入
        if (!oldPassword || !newPassword) {
            throw new AppError('请提供旧密码和新密码', 400)
        }

        if (newPassword.length < 6) {
            throw new AppError('新密码长度不能小于6位', 400)
        }

        // 查找管理员
        const admin = admins.find(a => a.id === adminId)
        if (!admin) {
            throw new AppError('管理员不存在', 404)
        }

        // 验证旧密码
        const isPasswordValid = await bcrypt.compare(oldPassword, admin.password)
        if (!isPasswordValid) {
            throw new AppError('旧密码错误', 401)
        }

        // 加密新密码
        admin.password = await bcrypt.hash(newPassword, 10)

        res.json({
            code: 200,
            message: '密码修改成功',
            data: null
        })
    } catch (error) {
        next(error)
    }
}

/**
 * 创建新管理员 (仅超级管理员可用)
 */
export const createAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const { username, email, password } = req.body

        // 验证输入
        if (!username || !email || !password) {
            throw new AppError('请提供完整的管理员信息', 400)
        }

        // 检查邮箱是否已存在
        const existingAdmin = admins.find(a => a.email === email)
        if (existingAdmin) {
            throw new AppError('该邮箱已被使用', 400)
        }

        // 加密密码
        const hashedPassword = await bcrypt.hash(password, 10)

        // 创建管理员
        const admin = {
            id: admins.length + 1,
            username,
            email,
            password: hashedPassword,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${username}`,
            role: 'admin',
            createdAt: new Date().toISOString()
        }

        admins.push(admin)

        const { password: _, ...adminInfo } = admin

        res.status(201).json({
            code: 200,
            message: '管理员创建成功',
            data: adminInfo
        })
    } catch (error) {
        next(error)
    }
}

/**
 * 获取所有管理员列表
 */
export const getAdminList = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const adminList = admins.map(({ password, ...admin }) => admin)

        res.json({
            code: 200,
            message: '获取成功',
            data: {
                list: adminList,
                total: adminList.length
            }
        })
    } catch (error) {
        next(error)
    }
}

/**
 * 删除管理员 (不能删除自己和ID为1的超级管理员)
 */
export const deleteAdmin = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const currentAdminId = (req as any).user?.id
        const targetAdminId = parseInt(req.params.id)

        // 不能删除自己
        if (currentAdminId === targetAdminId) {
            throw new AppError('不能删除自己的账号', 400)
        }

        // 不能删除ID为1的超级管理员
        if (targetAdminId === 1) {
            throw new AppError('不能删除超级管理员账号', 400)
        }

        const adminIndex = admins.findIndex(a => a.id === targetAdminId)
        if (adminIndex === -1) {
            throw new AppError('管理员不存在', 404)
        }

        admins.splice(adminIndex, 1)

        res.json({
            code: 200,
            message: '删除成功',
            data: null
        })
    } catch (error) {
        next(error)
    }
}
