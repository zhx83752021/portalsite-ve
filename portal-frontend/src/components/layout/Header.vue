<template>
  <header class="site-header">
    <!-- 顶部栏 -->
    <div class="top-bar">
      <div class="container">
        <div class="top-bar-content">
          <div class="top-left">
            <span class="welcome-text">欢迎访问综合门户网站</span>
            <span class="divider">|</span>
            <a href="#" class="top-link">设为首页</a>
            <span class="divider">|</span>
            <a href="#" class="top-link">加入收藏</a>
          </div>
          <div class="top-right">
            <span class="date-time">{{ currentDateTime }}</span>
          </div>
        </div>
      </div>
    </div>
    <!-- 主导航 -->
    <div class="main-header">
      <div class="container">
        <div class="header-content">
          <!-- Logo -->
          <div class="logo">
            <router-link to="/">
              <div class="logo-icon">
                <el-icon :size="40">
                  <House />
                </el-icon>
              </div>
              <div class="logo-info">
                <h1 class="logo-text">综合门户</h1>
                <p class="logo-subtitle">PORTAL WEBSITE</p>
              </div>
            </router-link>
          </div>
          <!-- 搜索框 -->
          <div class="header-search" v-if="!isMobile">
            <el-input v-model="searchKeyword" placeholder="请输入关键词搜索..." :prefix-icon="Search"
              @keyup.enter="handleSearch" clearable size="large" class="search-input">
              <template #append>
                <el-button @click="handleSearch" type="primary">搜索</el-button>
              </template>
            </el-input>
            <div class="hot-keywords">
              <span class="keywords-label">热搜：</span>
              <a href="#" class="keyword-item" v-for="keyword in hotKeywords" :key="keyword"
                @click.prevent="searchByKeyword(keyword)">
                {{ keyword }}
              </a>
            </div>
          </div>
          <!-- 移动端菜单按钮 -->
          <div class="user-area">
            <el-button v-if="isMobile" :icon="Menu" circle @click="toggleMobileMenu" class="mobile-menu-btn" />
          </div>
        </div>
      </div>
    </div>
    <!-- 导航菜单 -->
    <nav class="nav-bar" v-if="!isMobile">
      <div class="container">
        <el-menu :default-active="activeMenu" mode="horizontal" router :ellipsis="false" class="main-nav">
          <el-menu-item index="/">首页</el-menu-item>
          <el-menu-item index="/news">新闻</el-menu-item>
          <el-menu-item index="/finance">财经</el-menu-item>
          <el-menu-item index="/sports">体育</el-menu-item>
          <el-menu-item index="/entertainment">娱乐</el-menu-item>
          <el-menu-item index="/tech">科技</el-menu-item>
        </el-menu>
      </div>
    </nav>
    <!-- 移动端抽屉菜单 -->
    <el-drawer v-model="mobileMenuVisible" direction="rtl" size="70%" title="菜单">
      <el-menu :default-active="activeMenu" router @select="mobileMenuVisible = false">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="/news">新闻</el-menu-item>
        <el-menu-item index="/finance">财经</el-menu-item>
        <el-menu-item index="/sports">体育</el-menu-item>
        <el-menu-item index="/entertainment">娱乐</el-menu-item>
        <el-menu-item index="/tech">科技</el-menu-item>
      </el-menu>
      <div class="mobile-search">
        <el-input v-model="searchKeyword" placeholder="搜索..." :prefix-icon="Search" @keyup.enter="handleSearch" />
      </div>
    </el-drawer>
  </header>
</template>
<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Search, Menu, House } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()
const searchKeyword = ref('')
const mobileMenuVisible = ref(false)
const currentDateTime = ref('')
const hotKeywords = ref(['最新资讯', '热点新闻', '财经动态', '体育赛事', '科技创新'])

const isMobile = computed(() => appStore.isMobile)
const activeMenu = computed(() => route.path)
// 更新日期时间
const updateDateTime = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  const hours = String(now.getHours()).padStart(2, '0')
  const minutes = String(now.getMinutes()).padStart(2, '0')
  const seconds = String(now.getSeconds()).padStart(2, '0')
  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六']
  const weekDay = weekDays[now.getDay()]
  currentDateTime.value = `${year}-${month}-${day} ${hours}:${minutes}:${seconds} ${weekDay}`
}
let timer: number | null = null
onMounted(() => {
  updateDateTime()
  timer = window.setInterval(updateDateTime, 1000)
})
onBeforeUnmount(() => {
  if (timer) {
    clearInterval(timer)
  }
})
const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({
      path: '/news',
      query: { keyword: searchKeyword.value }
    })
    mobileMenuVisible.value = false
  } else {
    ElMessage.warning('请输入搜索关键词')
  }
}
const searchByKeyword = (keyword: string) => {
  searchKeyword.value = keyword
  handleSearch()
}
const toggleMobileMenu = () => {
  mobileMenuVisible.value = !mobileMenuVisible.value
}
</script>
<style scoped lang="css">
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* 顶部栏 - 门户网站风格 */
.top-bar {
  background: #f5f5f5;
  color: #666;
  font-size: 12px;
  height: 32px;
  line-height: 32px;
}

.top-bar-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 100%;
}

.top-left,
.top-right {
  display: flex;
  align-items: center;
  gap: 10px;
}

.welcome-text {
  color: #666;
  font-weight: 400;
}

.divider {
  color: #ccc;
  margin: 0 2px;
}

.top-link {
  color: #666;
  text-decoration: none;
  transition: color 0.2s;
  font-size: 12px;
}

.top-link:hover {
  color: #409EFF;
  text-decoration: underline;
}

.date-time {
  color: #666;
  font-family: Arial, 'Microsoft YaHei', sans-serif;
  font-weight: 400;
  font-size: 12px;
}

/* 主导航区域 - 政府网站风格 */
.main-header {
  background: #fff;
  padding: 18px 0;
  border-bottom: 1px solid #e5e7eb;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 30px;
}

/* Logo区域 - 简洁正式 */
.logo {
  flex-shrink: 0;
}

.logo a {
  display: flex;
  align-items: center;
  gap: 12px;
  text-decoration: none;
}

.logo-icon {
  width: 48px;
  height: 48px;
  background: #0066cc;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
}

.logo-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.logo-text {
  font-size: 22px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.2;
  letter-spacing: 0.5px;
}

.logo-subtitle {
  font-size: 12px;
  color: #666;
  margin: 0;
  line-height: 1;
  letter-spacing: 1px;
  text-transform: uppercase;
}

/* 搜索区域 - 扁平化风格 */
.header-search {
  flex: 1;
  max-width: 580px;
  display: flex;
  flex-direction: column;
}

.search-input {
  margin-bottom: 6px;
}

.search-input :deep(.el-input__wrapper) {
  border-radius: 2px;
  box-shadow: none;
  border: 1px solid #dcdfe6;
  transition: border-color 0.2s;
}

.search-input :deep(.el-input__wrapper:hover) {
  border-color: #0066cc;
}

.search-input :deep(.el-input__wrapper.is-focus) {
  border-color: #0066cc;
  box-shadow: none;
}

.search-input :deep(.el-input-group__append) {
  padding: 0;
  background: #0066cc;
  border: none;
  box-shadow: none;
}

.search-input :deep(.el-input-group__append .el-button) {
  border-radius: 0;
  padding: 0 40px;
  /* background: #0066cc; */
  border: none;
  color: #fff;
}



.hot-keywords {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  min-height: 20px;
  line-height: 20px;
}

.keywords-label {
  color: #666;
  font-size: 12px;
  line-height: 20px;
  white-space: nowrap;
}

.keyword-item {
  color: #333;
  font-size: 12px;
  text-decoration: none;
  transition: color 0.2s;
  line-height: 20px;
  white-space: nowrap;
}

.keyword-item:hover {
  color: #c8161d;
}

/* 用户区域 - 简洁风格 */
.user-area {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 5px 12px;
  border-radius: 2px;
  transition: background 0.2s;
}

.user-info:hover {
  background: #f5f5f5;
}

.username {
  font-size: 14px;
  color: #333;
  font-weight: 400;
}

/* 导航栏 - 政府网站蓝色风格 */
.nav-bar {
  background: #0066cc;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.main-nav {
  border-bottom: none;
  background: transparent;
}

.main-nav :deep(.el-menu-item) {
  color: #fff;
  border-bottom: none;
  font-size: 16px;
  font-weight: 400;
  line-height: 48px;
  transition: all 0.2s;
  letter-spacing: 0.5px;
  margin: 0;
  padding: 0 28px;
}

.main-nav :deep(.el-menu-item:hover) {
  background: rgba(255, 255, 255, 0.1);
}

.main-nav :deep(.el-menu-item.is-active) {
  background: #004c99;
  font-weight: 500;
}

.main-nav :deep(.el-menu-item .el-icon) {
  display: none;
}

/* 移动端样式 */
.mobile-menu-btn {
  margin-left: 10px;
}

.mobile-search {
  padding: 20px;
  border-top: 1px solid #eee;
  margin-top: 20px;
}

/* 响应式优化 */
@media (max-width: 768px) {
  .top-bar {
    display: none;
  }

  .main-header {
    padding: 12px 0;
  }

  .header-content {
    padding: 0 12px;
    gap: 12px;
  }

  .logo-text {
    font-size: 18px;
  }

  .logo-subtitle {
    font-size: 10px;
  }

  .logo-icon {
    width: 40px;
    height: 40px;
    border-radius: 4px;
  }

  .logo-icon :deep(.el-icon) {
    font-size: 28px !important;
  }
}

/* 平滑过渡动画 */
@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.site-header {
  animation: slideDown 0.4s ease-out;
}
</style>
