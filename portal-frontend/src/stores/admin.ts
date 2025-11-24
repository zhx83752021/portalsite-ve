import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { AdminInfo } from '@/api/admin'

/**
 * 管理员状态管理
 */
export const useAdminStore = defineStore('admin', () => {
    // 管理员信息
    const adminInfo = ref<AdminInfo | null>(null)

    // 管理员token
    const token = ref<string>('')

    /**
     * 初始化 - 从localStorage恢复状态
     */
    const init = () => {
        const savedToken = localStorage.getItem('admin_token')
        const savedAdminInfo = localStorage.getItem('admin_info')

        if (savedToken && savedAdminInfo) {
            token.value = savedToken
            try {
                adminInfo.value = JSON.parse(savedAdminInfo)
            } catch (error) {
                console.error('解析管理员信息失败:', error)
                logout()
            }
        }
    }

    /**
     * 登录
     */
    const login = (info: AdminInfo, adminToken: string) => {
        adminInfo.value = info
        token.value = adminToken

        // 持久化到localStorage
        localStorage.setItem('admin_token', adminToken)
        localStorage.setItem('admin_info', JSON.stringify(info))
    }

    /**
     * 登出
     */
    const logout = () => {
        adminInfo.value = null
        token.value = ''

        // 清除localStorage
        localStorage.removeItem('admin_token')
        localStorage.removeItem('admin_info')
    }

    /**
     * 更新管理员信息
     */
    const updateInfo = (info: Partial<AdminInfo>) => {
        if (adminInfo.value) {
            adminInfo.value = { ...adminInfo.value, ...info }
            localStorage.setItem('admin_info', JSON.stringify(adminInfo.value))
        }
    }

    /**
     * 是否已登录
     */
    const isLoggedIn = () => {
        return !!token.value && !!adminInfo.value
    }

    // 初始化
    init()

    return {
        adminInfo,
        token,
        login,
        logout,
        updateInfo,
        isLoggedIn
    }
})
