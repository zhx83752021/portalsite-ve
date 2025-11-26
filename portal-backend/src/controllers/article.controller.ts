import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../middlewares/auth'
import { AppError } from '../middlewares/errorHandler'

// 模拟文章数据
const mockArticle = (id: number) => ({
    id,
    title: `文章标题 ${id} - 这是一个很长的标题用于展示效果`,
    content: `<h2>文章正文</h2><p>这是文章的正文内容...</p>`,
    summary: '这是文章摘要，简要介绍文章的主要内容和核心观点。',
    cover: `https://picsum.photos/800/400?random=${id}`,
    categoryId: (id % 5) + 1,
    categoryName: ['头条', '财经', '体育', '娱乐', '科技'][id % 5],
    authorId: 1,
    authorName: '编辑' + ((id % 5) + 1),
    views: Math.floor(Math.random() * 10000),
    status: 1,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 30).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['标签1', '标签2', '标签3'].slice(0, Math.floor(Math.random() * 3) + 1)
})

export const getArticles = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 20
        const categoryId = req.query.categoryId ? Number(req.query.categoryId) : undefined
        const keyword = req.query.keyword as string | undefined

        let articles = Array.from({ length: 100 }, (_, i) => mockArticle(i + 1))

        // 分类筛选
        if (categoryId) {
            articles = articles.filter(a => a.categoryId === categoryId)
        }

        // 关键词搜索
        if (keyword) {
            articles = articles.filter(a =>
                a.title.includes(keyword) || a.summary.includes(keyword)
            )
        }

        const total = articles.length
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const list = articles.slice(start, end)

        res.json({
            code: 200,
            message: 'success',
            data: {
                list,
                total,
                page,
                pageSize
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getArticleById = (
    req: AuthRequest,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id)
        if (!id || isNaN(id)) {
            throw new AppError('无效的文章ID', 400)
        }

        const article = mockArticle(id)

        res.json({
            code: 200,
            message: 'success',
            data: article
        })
    } catch (error) {
        next(error)
    }
}

export const getHotArticles = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const limit = Number(req.query.limit) || 10
        const articles = Array.from({ length: limit }, (_, i) => mockArticle(i + 1))
            .sort((a, b) => b.views - a.views)

        res.json({
            code: 200,
            message: 'success',
            data: articles
        })
    } catch (error) {
        next(error)
    }
}

export const getRecommendArticles = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const limit = Number(req.query.limit) || 10
        const articles = Array.from({ length: limit }, (_, i) => mockArticle(i + 100))

        res.json({
            code: 200,
            message: 'success',
            data: articles
        })
    } catch (error) {
        next(error)
    }
}

export const searchArticles = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const keyword = req.query.keyword as string
        const page = Number(req.query.page) || 1
        const pageSize = Number(req.query.pageSize) || 20

        if (!keyword) {
            throw new AppError('请提供搜索关键词', 400)
        }

        const allArticles = Array.from({ length: 50 }, (_, i) => mockArticle(i + 1))
        const articles = allArticles.filter(a =>
            a.title.includes(keyword) || a.summary.includes(keyword)
        )

        const total = articles.length
        const start = (page - 1) * pageSize
        const end = start + pageSize
        const list = articles.slice(start, end)

        res.json({
            code: 200,
            message: 'success',
            data: {
                list,
                total,
                page,
                pageSize
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getRelatedArticles = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const id = Number(req.params.id)
        const limit = Number(req.query.limit) || 5

        if (!id || isNaN(id)) {
            throw new AppError('无效的文章ID', 400)
        }

        // 获取相同分类的其他文章作为相关文章
        const currentArticle = mockArticle(id)
        const allArticles = Array.from({ length: 50 }, (_, i) => mockArticle(i + 1))
        const relatedArticles = allArticles
            .filter(a => a.id !== id && a.categoryId === currentArticle.categoryId)
            .slice(0, limit)

        res.json({
            code: 200,
            message: 'success',
            data: relatedArticles
        })
    } catch (error) {
        next(error)
    }
}
