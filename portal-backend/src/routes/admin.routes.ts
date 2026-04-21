import { Router } from 'express'
import {
    adminLogin,
    getAdminInfo,
    updateAdminPassword,
    createAdmin,
    getAdminList,
    deleteAdmin
} from '../controllers/admin.controller'
import {
    adminListArticles,
    adminGetArticle,
    adminCreateArticle,
    adminUpdateArticle,
    adminDeleteArticle,
    adminListCategories,
    adminCreateCategory,
    adminUpdateCategory,
    adminDeleteCategory,
    adminListComments,
    adminUpdateComment,
    adminDeleteComment,
    adminGetStats
} from '../controllers/adminCms.controller'
import { authenticateToken } from '../middlewares/auth'
import { requireAdmin } from '../middlewares/adminAuth'

const router = Router()

// 公开路由 - 管理员登录
router.post('/login', adminLogin)

// 需要管理员认证的路由
router.use(authenticateToken, requireAdmin)

// 管理员信息相关
router.get('/info', getAdminInfo)
router.put('/password', updateAdminPassword)

// 控制台统计
router.get('/stats', adminGetStats)

// 内容管理 CMS
router.get('/articles', adminListArticles)
router.get('/articles/:id', adminGetArticle)
router.post('/articles', adminCreateArticle)
router.put('/articles/:id', adminUpdateArticle)
router.delete('/articles/:id', adminDeleteArticle)

router.get('/categories', adminListCategories)
router.post('/categories', adminCreateCategory)
router.put('/categories/:id', adminUpdateCategory)
router.delete('/categories/:id', adminDeleteCategory)

router.get('/comments', adminListComments)
router.patch('/comments/:id', adminUpdateComment)
router.delete('/comments/:id', adminDeleteComment)

// 管理员账号管理
router.post('/admins', createAdmin)
router.get('/admins', getAdminList)
router.delete('/admins/:id', deleteAdmin)

export default router
