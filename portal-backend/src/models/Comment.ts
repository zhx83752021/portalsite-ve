/**
 * 评论数据模型
 */
export interface Comment {
    id: number
    articleId: number
    userId: number
    username?: string
    userAvatar?: string
    content: string
    parentId?: number
    likes: number
    status: number // 0: 待审核, 1: 已通过, 2: 已拒绝
    createdAt: string
    updatedAt?: string
    replies?: Comment[]
}

/**
 * 评论创建数据
 */
export interface CommentCreateDTO {
    articleId: number
    content: string
    parentId?: number
}

/**
 * 评论查询参数
 */
export interface CommentQueryDTO {
    articleId?: number
    userId?: number
    status?: number
    page?: number
    pageSize?: number
}

/**
 * 评论列表响应
 */
export interface CommentListResponse {
    list: Comment[]
    total: number
    page: number
    pageSize: number
}
