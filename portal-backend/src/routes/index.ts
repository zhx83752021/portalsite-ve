import { Router } from 'express'
import authRoutes from './auth.routes'
import articleRoutes from './article.routes'
import categoryRoutes from './category.routes'
import userRoutes from './user.routes'
import adminRoutes from './admin.routes'

const router = Router()

// 供反向代理仅转发 /api 时的存活探针（与根路径 /health 行为一致）
router.get('/health', (_req, res) => {
    res.json({
        status: 'ok',
        scope: 'api',
        timestamp: new Date().toISOString(),
    })
})

router.use('/auth', authRoutes)
router.use('/articles', articleRoutes)
router.use('/categories', categoryRoutes)
router.use('/user', userRoutes)
router.use('/admin', adminRoutes)

export default router
