import { request } from './request'

export interface LoginParams {
    email: string
    password: string
}

export interface RegisterParams {
    username: string
    email: string
    password: string
}

export interface UserInfo {
    id: number
    username: string
    email: string
    avatar?: string
    role: string
}

export interface LoginResponse {
    token: string
    userInfo: UserInfo
}

// 用户登录
export const login = (data: LoginParams) => {
    return request.post<LoginResponse>('/auth/login', data)
}

// 用户注册
export const register = (data: RegisterParams) => {
    return request.post<LoginResponse>('/auth/register', data)
}

// 获取用户信息
export const getUserInfo = () => {
    return request.get<UserInfo>('/user/info')
}

// 更新用户信息
export const updateUserInfo = (data: Partial<UserInfo>) => {
    return request.put<UserInfo>('/user/info', data)
}

// 修改密码
export const changePassword = (oldPassword: string, newPassword: string) => {
    return request.put('/user/password', { oldPassword, newPassword })
}

// 上传头像
export const uploadAvatar = (file: File) => {
    const formData = new FormData()
    formData.append('avatar', file)
    return request.post<{ url: string }>('/user/avatar', formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    })
}
