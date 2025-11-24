import { defineStore } from 'pinia'
import { ref } from 'vue'

interface UserInfo {
    id: number
    username: string
    email: string
    avatar?: string
    role: string
}

export const useUserStore = defineStore('user', () => {
    const userInfo = ref<UserInfo | null>(null)
    const token = ref<string>('')
    const isLoggedIn = ref<boolean>(false)

    // 登录
    const login = (userData: UserInfo, userToken: string) => {
        userInfo.value = userData
        token.value = userToken
        isLoggedIn.value = true

        // 保存到本地存储
        localStorage.setItem('token', userToken)
        localStorage.setItem('userInfo', JSON.stringify(userData))
    }

    // 登出
    const logout = () => {
        userInfo.value = null
        token.value = ''
        isLoggedIn.value = false

        // 清除本地存储
        localStorage.removeItem('token')
        localStorage.removeItem('userInfo')
    }

    // 初始化用户信息（从本地存储恢复）
    const initUserInfo = () => {
        const savedToken = localStorage.getItem('token')
        const savedUserInfo = localStorage.getItem('userInfo')

        if (savedToken && savedUserInfo) {
            token.value = savedToken
            userInfo.value = JSON.parse(savedUserInfo)
            isLoggedIn.value = true
        }
    }

    // 更新用户信息
    const updateUserInfo = (data: Partial<UserInfo>) => {
        if (userInfo.value) {
            userInfo.value = { ...userInfo.value, ...data }
            localStorage.setItem('userInfo', JSON.stringify(userInfo.value))
        }
    }

    return {
        userInfo,
        token,
        isLoggedIn,
        login,
        logout,
        initUserInfo,
        updateUserInfo
    }
})
