import { request } from './request'

export interface Article {
    id: number
    title: string
    content: string
    summary: string
    cover?: string
    categoryId: number
    categoryName?: string
    authorId: number
    authorName?: string
    views: number
    status: number
    createdAt: string
    updatedAt: string
    tags?: string[]
}

export interface ArticleListParams {
    page?: number
    pageSize?: number
    categoryId?: number
    keyword?: string
    sort?: 'latest' | 'hot' | 'views'
}

export interface ArticleListResponse {
    list: Article[]
    total: number
    page: number
    pageSize: number
}

// 获取文章列表
export const getArticleList = (params: ArticleListParams) => {
    return request.get<ArticleListResponse>('/articles', params)
}

// 获取文章详情
export const getArticleDetail = (id: number) => {
    return request.get<Article>(`/articles/${id}`)
}

// 获取热门文章
export const getHotArticles = (limit: number = 10) => {
    return request.get<Article[]>('/articles/hot', { limit })
}

// 获取推荐文章
export const getRecommendArticles = (limit: number = 10) => {
    return request.get<Article[]>('/articles/recommend', { limit })
}

// 搜索文章
export const searchArticles = (keyword: string, page: number = 1, pageSize: number = 20) => {
    return request.get<ArticleListResponse>('/articles/search', { keyword, page, pageSize })
}

// 获取相关文章
export const getRelatedArticles = (id: number, limit: number = 5) => {
    return request.get<Article[]>(`/articles/${id}/related`, { limit })
}

/** 前台评论（仅展示已通过审核） */
export interface ArticleComment {
    id: number
    articleId: number
    userId: number
    username?: string
    userAvatar?: string
    content: string
    parentId?: number
    likes: number
    status: number
    createdAt: string
    updatedAt?: string
    replies?: ArticleComment[]
}

export interface ArticleCommentsResponse {
    list: ArticleComment[]
    total: number
    page: number
    pageSize: number
}

export const getArticleComments = (id: number, page: number = 1, pageSize: number = 20) => {
    return request.get<ArticleCommentsResponse>(`/articles/${id}/comments`, { page, pageSize })
}

export const postArticleComment = (
    id: number,
    data: { content: string; parentId?: number }
) => {
    return request.post<ArticleComment>(`/articles/${id}/comments`, data)
}
