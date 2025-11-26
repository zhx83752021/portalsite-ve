import { Router } from 'express'
import {
    getArticles,
    getArticleById,
    getHotArticles,
    getRecommendArticles,
    searchArticles,
    getRelatedArticles
} from '../controllers/article.controller'
import { optionalAuth } from '../middlewares/auth'

const router = Router()

router.get('/', optionalAuth, getArticles)
router.get('/hot', getHotArticles)
router.get('/recommend', getRecommendArticles)
router.get('/search', searchArticles)
router.get('/:id/related', getRelatedArticles)
router.get('/:id', optionalAuth, getArticleById)

export default router
