import axios from 'axios'
import type { Article } from './article'

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

/** —— CMS：文章 —— */
export interface AdminArticleListParams {
    page?: number
    pageSize?: number
    title?: string
    keyword?: string
    status?: '' | 'published' | 'draft' | 'archived'
    categoryId?: number
}

export interface AdminArticleListResponse {
    list: Article[]
    total: number
    page: number
    pageSize: number
}

export const getAdminArticles = async (
    params: AdminArticleListParams
): Promise<AdminArticleListResponse> => {
    return await adminApi.get('/articles', { params })
}

export const getAdminArticle = async (id: number): Promise<Article> => {
    return await adminApi.get(`/articles/${id}`)
}

export interface AdminArticlePayload {
    title: string
    content: string
    summary: string
    cover?: string
    categoryId: number
    tags?: string[]
    status?: 'draft' | 'published' | 'archived' | number
}

export const createAdminArticle = async (
    data: AdminArticlePayload
): Promise<Article> => {
    return await adminApi.post('/articles', data)
}

export const updateAdminArticle = async (
    id: number,
    data: Partial<AdminArticlePayload>
): Promise<Article> => {
    return await adminApi.put(`/articles/${id}`, data)
}

export const deleteAdminArticle = async (id: number): Promise<void> => {
    await adminApi.delete(`/articles/${id}`)
}

/** —— CMS：分类 —— */
export interface AdminCategory {
    id: number
    name: string
    slug: string
    description?: string
    parentId?: number
    sort?: number
    createdAt?: string
    updatedAt?: string
}

export const getAdminCategories = async (): Promise<AdminCategory[]> => {
    return await adminApi.get('/categories')
}

export const createAdminCategory = async (data: {
    name: string
    slug: string
    description?: string
    parentId?: number
    sort?: number
}): Promise<AdminCategory> => {
    return await adminApi.post('/categories', data)
}

export const updateAdminCategory = async (
    id: number,
    data: Partial<{ name: string; slug: string; description?: string; parentId?: number | null; sort?: number }>
): Promise<AdminCategory> => {
    return await adminApi.put(`/categories/${id}`, data)
}

export const deleteAdminCategory = async (id: number): Promise<void> => {
    await adminApi.delete(`/categories/${id}`)
}

/** —— CMS：评论审核 —— */
export interface AdminComment {
    id: number
    articleId: number
    articleTitle?: string
    userId: number
    username?: string
    userAvatar?: string
    content: string
    parentId?: number
    likes: number
    status: number
    createdAt: string
    updatedAt?: string
}

export interface AdminCommentListResponse {
    list: AdminComment[]
    total: number
    page: number
    pageSize: number
}

export const getAdminComments = async (params: {
    page?: number
    pageSize?: number
    articleId?: number
    status?: 'pending' | 'approved' | 'rejected'
}): Promise<AdminCommentListResponse> => {
    return await adminApi.get('/comments', { params })
}

export const patchAdminComment = async (
    id: number,
    status: 0 | 1 | 2
): Promise<AdminComment> => {
    return await adminApi.patch(`/comments/${id}`, { status })
}

export const deleteAdminComment = async (id: number): Promise<void> => {
    await adminApi.delete(`/comments/${id}`)
}

/** —— 控制台统计 —— */
export interface AdminStatsResponse {
    stats: {
        articles: number
        users: number
        comments: number
        views: number
    }
    recentArticles: Array<{ id: number; title: string; time: string }>
    recentComments: Array<{
        id: number
        content: string
        time: string
        username?: string
        articleId?: number
        articleTitle?: string
    }>
}

export const getAdminStats = async (): Promise<AdminStatsResponse> => {
    return await adminApi.get('/stats')
}
