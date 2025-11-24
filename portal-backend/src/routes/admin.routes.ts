import { Router } from 'express'
import {
    adminLogin,
    getAdminInfo,
    updateAdminPassword,
    createAdmin,
    getAdminList,
    deleteAdmin
} from '../controllers/admin.controller'
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

// 管理员管理（仅超级管理员）
router.post('/admins', createAdmin)
router.get('/admins', getAdminList)
router.delete('/admins/:id', deleteAdmin)

export default router
