import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
    const isMobile = ref<boolean>(false)
    const isTablet = ref<boolean>(false)
    const sidebarCollapsed = ref<boolean>(false)
    const loading = ref<boolean>(false)

    // 检测设备类型
    const checkDevice = () => {
        const width = window.innerWidth
        isMobile.value = width < 768
        isTablet.value = width >= 768 && width < 1024
    }

    // 切换侧边栏
    const toggleSidebar = () => {
        sidebarCollapsed.value = !sidebarCollapsed.value
    }

    // 设置加载状态
    const setLoading = (status: boolean) => {
        loading.value = status
    }

    return {
        isMobile,
        isTablet,
        sidebarCollapsed,
        loading,
        checkDevice,
        toggleSidebar,
        setLoading
    }
})
