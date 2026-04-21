import { Router } from 'express'
import {
    getArticles,
    getArticleById,
    getHotArticles,
    getRecommendArticles,
    searchArticles,
    getRelatedArticles,
    getArticleComments,
    postArticleComment
} from '../controllers/article.controller'
import { optionalAuth, authMiddleware } from '../middlewares/auth'

const router = Router()

router.get('/', optionalAuth, getArticles)
router.get('/hot', getHotArticles)
router.get('/recommend', getRecommendArticles)
router.get('/search', searchArticles)
router.get('/:id/related', getRelatedArticles)
router.get('/:id/comments', getArticleComments)
router.post('/:id/comments', authMiddleware, postArticleComment)
router.get('/:id', optionalAuth, getArticleById)

export default router
