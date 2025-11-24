/**
 * 用户数据模型
 */
export interface User {
    id: number
    username: string
    email: string
    password: string
    avatar?: string
    role: 'admin' | 'user'
    status: number // 0: 禁用, 1: 正常
    createdAt: string
    updatedAt: string
}

/**
 * 用户注册数据
 */
export interface UserRegisterDTO {
    username: string
    email: string
    password: string
}

/**
 * 用户登录数据
 */
export interface UserLoginDTO {
    email: string
    password: string
}

/**
 * 用户信息（不含密码）
 */
export interface UserInfo {
    id: number
    username: string
    email: string
    avatar?: string
    role: string
    createdAt: string
}

/**
 * 用户更新数据
 */
export interface UserUpdateDTO {
    username?: string
    email?: string
    avatar?: string
    password?: string
}
