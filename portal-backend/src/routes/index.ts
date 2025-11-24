import { Router } from 'express'
import authRoutes from './auth.routes'
import articleRoutes from './article.routes'
import categoryRoutes from './category.routes'
import userRoutes from './user.routes'
import adminRoutes from './admin.routes'

const router = Router()

router.use('/auth', authRoutes)
router.use('/articles', articleRoutes)
router.use('/categories', categoryRoutes)
router.use('/user', userRoutes)
router.use('/admin', adminRoutes)

export default router
