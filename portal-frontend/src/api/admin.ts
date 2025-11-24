import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api'

const adminApi = axios.create({
    baseURL: `${API_BASE_URL}/admin`,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
})

// 请求拦截器 - 添加token
adminApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('admin_token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// 响应拦截器 - 统一错误处理
adminApi.interceptors.response.use(
    (response) => {
        return response.data.data
    },
    (error) => {
        if (error.response) {
            const message = error.response.data?.message || '请求失败'
            throw new Error(message)
        } else if (error.request) {
            throw new Error('网络连接失败，请检查网络')
        } else {
            throw new Error('请求配置错误')
        }
    }
)

/**
 * 管理员登录接口
 */
export interface AdminLoginParams {
    email: string
    password: string
}

export interface AdminInfo {
    id: number
    username: string
    email: string
    avatar: string
    role: string
    createdAt: string
}

export interface AdminLoginResponse {
    token: string
    adminInfo: AdminInfo
}

export const adminLogin = async (params: AdminLoginParams): Promise<AdminLoginResponse> => {
    return await adminApi.post('/login', params)
}

/**
 * 获取管理员信息
 */
export const getAdminInfo = async (): Promise<AdminInfo> => {
    return await adminApi.get('/info')
}

/**
 * 修改管理员密码
 */
export interface UpdatePasswordParams {
    oldPassword: string
    newPassword: string
}

export const updateAdminPassword = async (params: UpdatePasswordParams): Promise<void> => {
    return await adminApi.put('/password', params)
}

/**
 * 获取管理员列表
 */
export interface AdminListResponse {
    list: AdminInfo[]
    total: number
}

export const getAdminList = async (): Promise<AdminListResponse> => {
    return await adminApi.get('/admins')
}

/**
 * 创建管理员
 */
export interface CreateAdminParams {
    username: string
    email: string
    password: string
}

export const createAdmin = async (params: CreateAdminParams): Promise<AdminInfo> => {
    return await adminApi.post('/admins', params)
}

/**
 * 删除管理员
 */
export const deleteAdmin = async (id: number): Promise<void> => {
    return await adminApi.delete(`/admins/${id}`)
}
