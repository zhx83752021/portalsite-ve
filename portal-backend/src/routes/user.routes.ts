import { Router } from 'express'
import { getUserInfo, updateUserInfo } from '../controllers/user.controller'
import { authMiddleware } from '../middlewares/auth'

const router = Router()

router.get('/info', authMiddleware, getUserInfo)
router.put('/info', authMiddleware, updateUserInfo)

export default router
