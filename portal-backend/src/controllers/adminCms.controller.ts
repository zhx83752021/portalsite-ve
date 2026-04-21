import { Response, NextFunction } from 'express'
import { AuthRequest } from '../middlewares/auth'
import { AppError } from '../middlewares/errorHandler'
import {
    articleService,
    categoryService,
    commentService
} from '../services/prismaService'
import { prisma } from '../config/database'
import { ArticleQueryDTO } from '../models/Article'

/** GET /api/admin/articles */
export const adminListArticles = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const statusParam = (req.query.status as string) || ''
        let statusNum = -1
        if (statusParam === 'published') statusNum = 1
        else if (statusParam === 'draft') statusNum = 0
        else if (statusParam === 'archived') statusNum = 2

        const q: ArticleQueryDTO = {
            page: Number(req.query.page) || 1,
            pageSize: Number(req.query.pageSize) || 20,
            categoryId: req.query.categoryId ? Number(req.query.categoryId) : undefined,
            keyword: (req.query.title as string) || (req.query.keyword as string) || undefined,
            status: statusNum,
            sortBy: (req.query.sort as any) || 'createdAt',
            order: 'desc'
        }

        const data = await articleService.getArticlesAdmin(q)
        res.json({ code: 200, message: 'success', data })
    } catch (e) {
        next(e)
    }
}

/** GET /api/admin/articles/:id */
export const adminGetArticle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)
        const article = await articleService.getArticleByIdWithoutViewIncrement(id)
        if (!article) throw new AppError('文章不存在', 404)
        res.json({ code: 200, message: 'success', data: article })
    } catch (e) {
        next(e)
    }
}

/** POST /api/admin/articles */
export const adminCreateArticle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const uid = req.user?.id
        if (!uid) throw new AppError('未认证', 401)

        const { title, content, summary, cover, categoryId, tags, status } = req.body
        if (!title || !content || !summary || !categoryId) {
            throw new AppError('标题、内容、摘要、分类为必填', 400)
        }

        const st =
            status === 'draft' || status === 0
                ? 0
                : status === 'archived' || status === 2
                  ? 2
                  : 1

        const article = await articleService.createArticle({
            title,
            content,
            summary,
            cover,
            categoryId: Number(categoryId),
            authorId: uid,
            tags: Array.isArray(tags) ? tags : [],
            status: st
        })

        res.status(201).json({ code: 200, message: '创建成功', data: article })
    } catch (e) {
        next(e)
    }
}

/** PUT /api/admin/articles/:id */
export const adminUpdateArticle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)

        const { title, content, summary, cover, categoryId, tags, status } = req.body
        const payload: any = {}
        if (title !== undefined) payload.title = title
        if (content !== undefined) payload.content = content
        if (summary !== undefined) payload.summary = summary
        if (cover !== undefined) payload.cover = cover
        if (categoryId !== undefined) payload.categoryId = Number(categoryId)
        if (tags !== undefined) payload.tags = tags

        if (status !== undefined) {
            if (status === 'draft' || status === 0) payload.status = 0
            else if (status === 'archived' || status === 2) payload.status = 2
            else payload.status = 1
        }

        const article = await articleService.updateArticle(id, payload)
        if (!article) throw new AppError('文章不存在', 404)
        res.json({ code: 200, message: '更新成功', data: article })
    } catch (e) {
        next(e)
    }
}

/** DELETE /api/admin/articles/:id */
export const adminDeleteArticle = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)
        const ok = await articleService.deleteArticle(id)
        if (!ok) throw new AppError('删除失败', 400)
        res.json({ code: 200, message: '删除成功', data: null })
    } catch (e) {
        next(e)
    }
}

/** GET /api/admin/categories — 与前台一致，管理端可复用 */
export const adminListCategories = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const list = await categoryService.getCategories()
        res.json({ code: 200, message: 'success', data: list })
    } catch (e) {
        next(e)
    }
}

/** POST /api/admin/categories */
export const adminCreateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const { name, slug, description, parentId, sort } = req.body
        if (!name || !slug) throw new AppError('名称与 slug 必填', 400)
        const cat = await categoryService.createCategory({
            name,
            slug,
            description,
            parentId: parentId != null ? Number(parentId) : undefined,
            sort: sort != null ? Number(sort) : 0
        })
        res.status(201).json({ code: 200, message: '创建成功', data: cat })
    } catch (e) {
        next(e)
    }
}

/** PUT /api/admin/categories/:id */
export const adminUpdateCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)
        const { name, slug, description, parentId, sort } = req.body
        const payload: any = {}
        if (name !== undefined) payload.name = name
        if (slug !== undefined) payload.slug = slug
        if (description !== undefined) payload.description = description
        if (parentId !== undefined) payload.parentId = parentId === null ? null : Number(parentId)
        if (sort !== undefined) payload.sort = Number(sort)

        const cat = await categoryService.updateCategory(id, payload)
        if (!cat) throw new AppError('分类不存在或无法更新', 404)
        res.json({ code: 200, message: '更新成功', data: cat })
    } catch (e) {
        next(e)
    }
}

/** DELETE /api/admin/categories/:id */
export const adminDeleteCategory = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)
        const ok = await categoryService.deleteCategory(id)
        if (!ok) throw new AppError('删除失败，可能仍有文章引用该分类', 400)
        res.json({ code: 200, message: '删除成功', data: null })
    } catch (e) {
        next(e)
    }
}

/** GET /api/admin/comments */
export const adminListComments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const q = {
            articleId: req.query.articleId ? Number(req.query.articleId) : undefined,
            status:
                req.query.status === 'pending'
                    ? 0
                    : req.query.status === 'approved'
                      ? 1
                      : req.query.status === 'rejected'
                        ? 2
                        : undefined,
            page: Number(req.query.page) || 1,
            pageSize: Number(req.query.pageSize) || 20
        }
        const data = await commentService.getComments(q as any)
        res.json({ code: 200, message: 'success', data })
    } catch (e) {
        next(e)
    }
}

/** DELETE /api/admin/comments/:id */
export const adminDeleteComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)
        const ok = await commentService.deleteComment(id)
        if (!ok) throw new AppError('删除失败', 400)
        res.json({ code: 200, message: '删除成功', data: null })
    } catch (e) {
        next(e)
    }
}

/** PATCH /api/admin/comments/:id */
export const adminUpdateComment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const id = Number(req.params.id)
        if (!id) throw new AppError('无效 ID', 400)
        const { status } = req.body
        if (status !== 0 && status !== 1 && status !== 2) {
            throw new AppError('status 须为 0/1/2（待审/通过/拒绝）', 400)
        }
        const c = await commentService.updateCommentStatus(id, status)
        if (!c) throw new AppError('评论不存在', 404)
        res.json({ code: 200, message: '更新成功', data: c })
    } catch (e) {
        next(e)
    }
}

/** GET /api/admin/stats —— 控制台总览指标 */
export const adminGetStats = async (_req: AuthRequest, res: Response, next: NextFunction) => {
    try {
        const [articles, users, comments, viewsAgg, recentArticles, recentComments] = await Promise.all([
            prisma.article.count(),
            prisma.user.count(),
            prisma.comment.count(),
            prisma.article.aggregate({ _sum: { views: true } }),
            prisma.article.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: { id: true, title: true, createdAt: true }
            }),
            prisma.comment.findMany({
                orderBy: { createdAt: 'desc' },
                take: 5,
                select: {
                    id: true,
                    content: true,
                    createdAt: true,
                    user: { select: { username: true } },
                    article: { select: { id: true, title: true } }
                }
            })
        ])

        res.json({
            code: 200,
            message: 'success',
            data: {
                stats: {
                    articles,
                    users,
                    comments,
                    views: viewsAgg._sum.views ?? 0
                },
                recentArticles: recentArticles.map((a) => ({
                    id: a.id,
                    title: a.title,
                    time: a.createdAt.toISOString()
                })),
                recentComments: recentComments.map((c) => ({
                    id: c.id,
                    content: c.content,
                    time: c.createdAt.toISOString(),
                    username: c.user?.username,
                    articleId: c.article?.id,
                    articleTitle: c.article?.title
                }))
            }
        })
    } catch (e) {
        next(e)
    }
}
