/**
 * 文章数据模型
 */
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
    status: number // 0: 草稿, 1: 已发布, 2: 已下架
    tags?: string[]
    createdAt: string
    updatedAt: string
}

/**
 * 文章创建数据
 */
export interface ArticleCreateDTO {
    title: string
    content: string
    summary: string
    cover?: string
    categoryId: number
    tags?: string[]
    status?: number
}

/**
 * 文章更新数据
 */
export interface ArticleUpdateDTO {
    title?: string
    content?: string
    summary?: string
    cover?: string
    categoryId?: number
    tags?: string[]
    status?: number
}

/**
 * 文章列表查询参数
 */
export interface ArticleQueryDTO {
    page?: number
    pageSize?: number
    categoryId?: number
    keyword?: string
    status?: number
    sortBy?: 'createdAt' | 'views' | 'updatedAt'
    order?: 'asc' | 'desc'
}

/**
 * 文章列表响应
 */
export interface ArticleListResponse {
    list: Article[]
    total: number
    page: number
    pageSize: number
}
