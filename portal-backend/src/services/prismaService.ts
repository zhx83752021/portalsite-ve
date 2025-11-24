/**
 * Prisma数据库服务层
 * 提供完整的数据库CRUD操作
 */

import { prisma } from '../config/database'
import { Article, ArticleQueryDTO, ArticleListResponse } from '../models/Article'
import { Category } from '../models/Category'
import { Comment, CommentQueryDTO, CommentListResponse } from '../models/Comment'
import { User, UserInfo } from '../models/User'

/**
 * 文章服务
 */
export const articleService = {
    /**
     * 获取文章列表
     */
    async getArticles(query: ArticleQueryDTO): Promise<ArticleListResponse> {
        const page = query.page || 1
        const pageSize = query.pageSize || 20
        const skip = (page - 1) * pageSize

        // 构建查询条件
        const where: any = {}

        if (query.status !== undefined) {
            where.status = query.status === 1 ? 'PUBLISHED' : query.status === 0 ? 'DRAFT' : 'ARCHIVED'
        } else {
            where.status = 'PUBLISHED' // 默认只查询已发布的
        }

        if (query.categoryId) {
            where.categoryId = query.categoryId
        }

        if (query.keyword) {
            where.OR = [
                { title: { contains: query.keyword, mode: 'insensitive' } },
                { summary: { contains: query.keyword, mode: 'insensitive' } }
            ]
        }

        // 排序
        const sortBy = query.sortBy || 'createdAt'
        const order = query.order || 'desc'
        const orderBy: any = {}
        orderBy[sortBy] = order

        // 查询数据
        const [articles, total] = await Promise.all([
            prisma.article.findMany({
                where,
                include: {
                    category: { select: { name: true } },
                    author: { select: { username: true } }
                },
                orderBy,
                skip,
                take: pageSize
            }),
            prisma.article.count({ where })
        ])

        // 转换数据格式
        const list: Article[] = articles.map(article => ({
            id: article.id,
            title: article.title,
            content: article.content,
            summary: article.summary,
            cover: article.cover || undefined,
            categoryId: article.categoryId,
            categoryName: article.category.name,
            authorId: article.authorId,
            authorName: article.author.username,
            views: article.views,
            status: article.status === 'PUBLISHED' ? 1 : article.status === 'DRAFT' ? 0 : 2,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        }))

        return { list, total, page, pageSize }
    },

    /**
     * 根据ID获取文章
     */
    async getArticleById(id: number): Promise<Article | null> {
        const article = await prisma.article.findUnique({
            where: { id },
            include: {
                category: { select: { name: true } },
                author: { select: { username: true } }
            }
        })

        if (!article) return null

        // 增加浏览量
        await prisma.article.update({
            where: { id },
            data: { views: { increment: 1 } }
        })

        return {
            id: article.id,
            title: article.title,
            content: article.content,
            summary: article.summary,
            cover: article.cover || undefined,
            categoryId: article.categoryId,
            categoryName: article.category.name,
            authorId: article.authorId,
            authorName: article.author.username,
            views: article.views + 1,
            status: article.status === 'PUBLISHED' ? 1 : article.status === 'DRAFT' ? 0 : 2,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        }
    },

    /**
     * 获取热门文章
     */
    async getHotArticles(limit: number = 10): Promise<Article[]> {
        const articles = await prisma.article.findMany({
            where: { status: 'PUBLISHED' },
            include: {
                category: { select: { name: true } },
                author: { select: { username: true } }
            },
            orderBy: { views: 'desc' },
            take: limit
        })

        return articles.map(article => ({
            id: article.id,
            title: article.title,
            content: article.content,
            summary: article.summary,
            cover: article.cover || undefined,
            categoryId: article.categoryId,
            categoryName: article.category.name,
            authorId: article.authorId,
            authorName: article.author.username,
            views: article.views,
            status: 1,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        }))
    },

    /**
     * 获取推荐文章（随机）
     */
    async getRecommendArticles(limit: number = 10): Promise<Article[]> {
        // PostgreSQL使用RANDOM()
        const articles = await prisma.$queryRaw<any[]>`
            SELECT a.*, c.name as category_name, u.username as author_name
            FROM articles a
            LEFT JOIN categories c ON a.category_id = c.id
            LEFT JOIN users u ON a.author_id = u.id
            WHERE a.status = 'PUBLISHED'
            ORDER BY RANDOM()
            LIMIT ${limit}
        `

        return articles.map(article => ({
            id: article.id,
            title: article.title,
            content: article.content,
            summary: article.summary,
            cover: article.cover || undefined,
            categoryId: article.category_id,
            categoryName: article.category_name,
            authorId: article.author_id,
            authorName: article.author_name,
            views: article.views,
            status: 1,
            tags: article.tags,
            createdAt: new Date(article.created_at).toISOString(),
            updatedAt: new Date(article.updated_at).toISOString()
        }))
    },

    /**
     * 创建文章
     */
    async createArticle(data: any): Promise<Article> {
        const article = await prisma.article.create({
            data: {
                title: data.title,
                content: data.content,
                summary: data.summary,
                cover: data.cover,
                categoryId: data.categoryId,
                authorId: data.authorId,
                tags: data.tags || [],
                status: data.status === 0 ? 'DRAFT' : data.status === 2 ? 'ARCHIVED' : 'PUBLISHED'
            },
            include: {
                category: { select: { name: true } },
                author: { select: { username: true } }
            }
        })

        return {
            id: article.id,
            title: article.title,
            content: article.content,
            summary: article.summary,
            cover: article.cover || undefined,
            categoryId: article.categoryId,
            categoryName: article.category.name,
            authorId: article.authorId,
            authorName: article.author.username,
            views: article.views,
            status: article.status === 'PUBLISHED' ? 1 : article.status === 'DRAFT' ? 0 : 2,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        }
    },

    /**
     * 更新文章
     */
    async updateArticle(id: number, data: any): Promise<Article | null> {
        const updateData: any = {}
        if (data.title !== undefined) updateData.title = data.title
        if (data.content !== undefined) updateData.content = data.content
        if (data.summary !== undefined) updateData.summary = data.summary
        if (data.cover !== undefined) updateData.cover = data.cover
        if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
        if (data.tags !== undefined) updateData.tags = data.tags
        if (data.status !== undefined) {
            updateData.status = data.status === 0 ? 'DRAFT' : data.status === 2 ? 'ARCHIVED' : 'PUBLISHED'
        }

        const article = await prisma.article.update({
            where: { id },
            data: updateData,
            include: {
                category: { select: { name: true } },
                author: { select: { username: true } }
            }
        })

        return {
            id: article.id,
            title: article.title,
            content: article.content,
            summary: article.summary,
            cover: article.cover || undefined,
            categoryId: article.categoryId,
            categoryName: article.category.name,
            authorId: article.authorId,
            authorName: article.author.username,
            views: article.views,
            status: article.status === 'PUBLISHED' ? 1 : article.status === 'DRAFT' ? 0 : 2,
            tags: article.tags,
            createdAt: article.createdAt.toISOString(),
            updatedAt: article.updatedAt.toISOString()
        }
    },

    /**
     * 删除文章
     */
    async deleteArticle(id: number): Promise<boolean> {
        try {
            await prisma.article.delete({ where: { id } })
            return true
        } catch {
            return false
        }
    }
}

/**
 * 分类服务
 */
export const categoryService = {
    async getCategories(): Promise<Category[]> {
        const categories = await prisma.category.findMany({
            orderBy: { sort: 'asc' }
        })

        return categories.map(cat => ({
            id: cat.id,
            name: cat.name,
            slug: cat.slug,
            description: cat.description || undefined,
            parentId: cat.parentId || undefined,
            sort: cat.sort || undefined,
            createdAt: cat.createdAt.toISOString(),
            updatedAt: cat.updatedAt.toISOString()
        }))
    },

    async getCategoryById(id: number): Promise<Category | null> {
        const category = await prisma.category.findUnique({ where: { id } })
        if (!category) return null

        return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            description: category.description || undefined,
            parentId: category.parentId || undefined,
            sort: category.sort || undefined,
            createdAt: category.createdAt.toISOString(),
            updatedAt: category.updatedAt.toISOString()
        }
    }
}

/**
 * 用户服务
 */
export const userService = {
    async getUserByEmail(email: string): Promise<User | null> {
        return await prisma.user.findUnique({ where: { email } }) as User | null
    },

    async getUserById(id: number): Promise<User | null> {
        return await prisma.user.findUnique({ where: { id } }) as User | null
    },

    async createUser(data: any): Promise<User> {
        return await prisma.user.create({
            data: {
                username: data.username,
                email: data.email,
                password: data.password,
                avatar: data.avatar,
                role: data.role || 'USER'
            }
        }) as User
    },

    async getUserInfo(id: number): Promise<UserInfo | null> {
        const user = await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                username: true,
                email: true,
                avatar: true,
                role: true,
                createdAt: true
            }
        })

        if (!user) return null

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar || undefined,
            role: user.role,
            createdAt: user.createdAt.toISOString()
        }
    }
}

/**
 * 评论服务
 */
export const commentService = {
    async getComments(query: CommentQueryDTO): Promise<CommentListResponse> {
        const page = query.page || 1
        const pageSize = query.pageSize || 20
        const skip = (page - 1) * pageSize

        const where: any = {}
        if (query.articleId) where.articleId = query.articleId
        if (query.userId) where.userId = query.userId
        if (query.status !== undefined) {
            where.status = query.status === 0 ? 'PENDING' : query.status === 1 ? 'APPROVED' : 'REJECTED'
        }

        const [comments, total] = await Promise.all([
            prisma.comment.findMany({
                where,
                include: {
                    user: { select: { username: true, avatar: true } },
                    replies: {
                        include: {
                            user: { select: { username: true, avatar: true } }
                        }
                    }
                },
                orderBy: { createdAt: 'desc' },
                skip,
                take: pageSize
            }),
            prisma.comment.count({ where })
        ])

        const list: Comment[] = comments.map(comment => ({
            id: comment.id,
            articleId: comment.articleId,
            userId: comment.userId,
            username: comment.user.username,
            userAvatar: comment.user.avatar || undefined,
            content: comment.content,
            parentId: comment.parentId || undefined,
            likes: comment.likes,
            status: comment.status === 'APPROVED' ? 1 : comment.status === 'PENDING' ? 0 : 2,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString(),
            replies: comment.replies?.map(reply => ({
                id: reply.id,
                articleId: reply.articleId,
                userId: reply.userId,
                username: reply.user.username,
                userAvatar: reply.user.avatar || undefined,
                content: reply.content,
                parentId: reply.parentId || undefined,
                likes: reply.likes,
                status: 1,
                createdAt: reply.createdAt.toISOString(),
                updatedAt: reply.updatedAt.toISOString()
            }))
        }))

        return { list, total, page, pageSize }
    },

    async createComment(data: any): Promise<Comment> {
        const comment = await prisma.comment.create({
            data: {
                articleId: data.articleId,
                userId: data.userId,
                content: data.content,
                parentId: data.parentId,
                status: 'PENDING'
            },
            include: {
                user: { select: { username: true, avatar: true } }
            }
        })

        return {
            id: comment.id,
            articleId: comment.articleId,
            userId: comment.userId,
            username: comment.user.username,
            userAvatar: comment.user.avatar || undefined,
            content: comment.content,
            parentId: comment.parentId || undefined,
            likes: comment.likes,
            status: 0,
            createdAt: comment.createdAt.toISOString(),
            updatedAt: comment.updatedAt.toISOString()
        }
    }
}
