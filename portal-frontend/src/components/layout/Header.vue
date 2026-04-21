<template>
  <header class="site-header">
    <!-- 顶部条：深蓝 · 日期 · 指数 · 天气 -->
    <div class="top-bar">
      <div class="container top-bar-inner">
        <div class="top-left">
          <span class="brand-mark">CLM · 综合门户</span>
          <span class="dot">·</span>
          <span class="date-time">{{ currentDateTime }}</span>
        </div>
        <div class="top-right">
          <span class="idx">
            <span class="idx-name">上证</span>
            <span class="idx-val">{{ idx.sh.val }}</span>
            <span class="idx-chg" :class="idx.sh.dir">{{ idx.sh.chg }}</span>
          </span>
          <span class="idx">
            <span class="idx-name">深证</span>
            <span class="idx-val">{{ idx.sz.val }}</span>
            <span class="idx-chg" :class="idx.sz.dir">{{ idx.sz.chg }}</span>
          </span>
          <span class="idx weather">
            <el-icon>
              <Sunny />
            </el-icon> 晴 12°C
          </span>
        </div>
      </div>
    </div>

    <!-- 主品牌区：方印 · 标题 · 搜索 -->
    <div class="main-header">
      <div class="container header-content">
        <router-link to="/" class="logo">
          <div class="logo-seal" aria-hidden="true">门</div>
          <div class="logo-info">
            <h1 class="logo-title">综合门户</h1>
            <p class="logo-sub">COMPREHENSIVE · PORTAL</p>
          </div>
        </router-link>

        <div class="header-search" v-if="!isMobile">
          <div class="search-box" :class="{ focus: searchFocus }">
            <el-icon class="search-ico">
              <Search />
            </el-icon>
            <input v-model="searchKeyword" class="search-input" placeholder="搜索新闻、财经、体育……"
              @focus="searchFocus = true" @blur="searchFocus = false" @keyup.enter="handleSearch" />
            <button class="search-btn" type="button" @click="handleSearch">搜索</button>
          </div>
          <div class="hot-keywords">
            <span class="eyebrow">热搜</span>
            <a v-for="keyword in hotKeywords" :key="keyword" href="#" class="keyword"
              @click.prevent="searchByKeyword(keyword)">
              {{ keyword }}
            </a>
          </div>
        </div>

        <div class="user-area">
          <el-button v-if="isMobile" :icon="Menu" circle @click="toggleMobileMenu" class="mobile-menu-btn" />
        </div>
      </div>
    </div>

    <!-- 主导航：下划线 hover -->
    <nav class="nav-bar" v-if="!isMobile">
      <div class="container nav-inner">
        <router-link
          v-for="item in navItems"
          :key="item.name"
          :to="item.to"
          class="nav-link"
          :class="{ active: isNavItemActive(item) }"
        >
          {{ item.name }}
        </router-link>
        <span class="nav-spacer" />
        <a href="/admin/login" class="nav-admin" aria-label="后台管理入口">
          <el-icon>
            <Setting />
          </el-icon> 管理
        </a>
      </div>
    </nav>

    <!-- 移动端抽屉 -->
    <el-drawer v-model="mobileMenuVisible" direction="rtl" size="72%" title="导航">
      <div class="m-nav">
        <router-link v-for="item in navItems" :key="item.name" :to="item.to" class="m-nav-link"
          @click="mobileMenuVisible = false">
          {{ item.name }}
        </router-link>
      </div>
      <div class="m-search">
        <el-input v-model="searchKeyword" placeholder="搜索..." :prefix-icon="Search" @keyup.enter="handleSearch" />
      </div>
    </el-drawer>
  </header>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '@/stores/app'
import { Search, Menu, Sunny, Setting } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { RouteLocationRaw } from 'vue-router'

const router = useRouter()
const route = useRoute()
const appStore = useAppStore()

const searchKeyword = ref('')
const searchFocus = ref(false)
const mobileMenuVisible = ref(false)
const currentDateTime = ref('')

const hotKeywords = ref(['两会', '央行政策', '奥运', 'AI 大模型', '新能源'])

interface NavItem {
  name: string
  to: RouteLocationRaw
  activeMatch: 'home' | 'news' | 'finance' | 'tech' | 'sports' | 'entertainment'
}

const navItems: NavItem[] = [
  { name: '首页', to: '/', activeMatch: 'home' },
  { name: '新闻中心', to: '/news', activeMatch: 'news' },
  { name: '财经', to: '/finance', activeMatch: 'finance' },
  { name: '科技', to: '/tech', activeMatch: 'tech' },
  { name: '体育', to: '/sports', activeMatch: 'sports' },
  { name: '娱乐', to: '/entertainment', activeMatch: 'entertainment' },
]

const idx = ref({
  sh: { val: '3213.54', chg: '+0.52%', dir: 'up' },
  sz: { val: '10542.11', chg: '-0.13%', dir: 'down' },
})

const isMobile = computed(() => appStore.isMobile)

const isNavItemActive = (item: NavItem) => {
  const p = route.path
  switch (item.activeMatch) {
    case 'home':
      return p === '/'
    case 'news':
      return p === '/news' || p.startsWith('/news/')
    case 'finance':
      return p === '/finance' || p.startsWith('/finance/')
    case 'tech':
      return p === '/tech' || p.startsWith('/tech/')
    case 'sports':
      return p === '/sports' || p.startsWith('/sports/')
    case 'entertainment':
      return p === '/entertainment' || p.startsWith('/entertainment/')
    default:
      return false
  }
}

const updateDateTime = () => {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  const weekDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
  currentDateTime.value = `${now.getFullYear()}.${pad(now.getMonth() + 1)}.${pad(now.getDate())} ${pad(now.getHours())}:${pad(now.getMinutes())} ${weekDays[now.getDay()]}`
}

let timer: number | null = null
onMounted(() => {
  updateDateTime()
  timer = window.setInterval(updateDateTime, 1000)
})
onBeforeUnmount(() => {
  if (timer) clearInterval(timer)
})

const handleSearch = () => {
  if (searchKeyword.value.trim()) {
    router.push({ path: '/news', query: { keyword: searchKeyword.value } })
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

<style scoped>
.site-header {
  position: sticky;
  top: 0;
  z-index: 1000;
  background: #fff;
  border-bottom: 1px solid var(--line);
}

/* ============ 顶部条 ============ */
.top-bar {
  background: var(--brand-navy);
  color: rgba(255, 255, 255, 0.9);
  font-size: var(--fs-micro);
  height: 36px;
}

.top-bar-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.top-left,
.top-right {
  display: flex;
  align-items: center;
  gap: 14px;
}

.brand-mark {
  font-family: var(--font-display);
  letter-spacing: 0.08em;
  color: #fff;
}

.dot {
  color: rgba(255, 255, 255, 0.4);
}

.date-time {
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  color: rgba(255, 255, 255, 0.78);
  letter-spacing: 0.02em;
}

.idx {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-micro);
  color: rgba(255, 255, 255, 0.82);
}

.idx-name {
  color: rgba(255, 255, 255, 0.6);
}

.idx-val {
  color: #fff;
}

.idx-chg.up {
  color: #ff6b5b;
}

.idx-chg.down {
  color: #5ee1a7;
}

.idx.weather {
  color: rgba(255, 255, 255, 0.7);
}

.idx.weather .el-icon {
  font-size: 14px;
  color: var(--brand-gold);
}

/* ============ 主品牌区 ============ */
.main-header {
  background: #fff;
  padding: 20px 0;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 32px;
}

.logo {
  display: flex;
  align-items: center;
  gap: 14px;
  text-decoration: none;
  color: inherit;
  flex-shrink: 0;
}

.logo-seal {
  width: 52px;
  height: 52px;
  background: var(--brand-navy);
  color: #fff;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 900;
  letter-spacing: 0;
  position: relative;
  box-shadow: inset 0 0 0 2px rgba(255, 255, 255, 0.08);
}

.logo-seal::after {
  content: '';
  position: absolute;
  inset: 4px;
  border: 1px solid rgba(255, 255, 255, 0.32);
  border-radius: 2px;
  pointer-events: none;
}

.logo-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.logo-title {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: 700;
  color: var(--ink-900);
  margin: 0;
  line-height: 1;
  letter-spacing: 0.04em;
}

.logo-sub {
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  color: var(--ink-400);
  margin: 0;
  line-height: 1;
  letter-spacing: 0.24em;
}

/* ============ 搜索 ============ */
.header-search {
  flex: 1;
  max-width: 520px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 8px 8px 14px;
  border: none;
  border-bottom: 2px solid var(--line-strong);
  transition: border-color var(--dur-base) var(--ease);
}

.search-box.focus {
  border-bottom-color: var(--brand-navy);
}

.search-ico {
  color: var(--ink-400);
  font-size: 18px;
}

.search-input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--fs-list);
  font-family: var(--font-body);
  color: var(--ink-900);
  padding: 4px 0;
}

.search-input::placeholder {
  color: var(--ink-400);
  font-style: italic;
  font-family: var(--font-display);
}

.search-btn {
  background: var(--brand-navy);
  color: #fff;
  border: none;
  border-radius: var(--radius-xs);
  padding: 8px 20px;
  font-size: var(--fs-meta);
  font-weight: var(--fw-medium);
  cursor: pointer;
  letter-spacing: 0.1em;
  transition: background var(--dur-fast) var(--ease);
}

.search-btn:hover {
  background: var(--brand-navy-600);
}

.hot-keywords {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.eyebrow {
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-red);
}

.keyword {
  font-size: var(--fs-meta);
  color: var(--ink-600);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease);
}

.keyword:hover {
  color: var(--brand-red);
}

/* ============ 主导航 ============ */
.nav-bar {
  background: #fff;
  border-top: 1px solid var(--line);
  border-bottom: 2px solid var(--brand-navy);
}

.nav-inner {
  display: flex;
  align-items: stretch;
  gap: 4px;
  height: 48px;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0 20px;
  font-size: var(--fs-list);
  font-weight: var(--fw-medium);
  color: var(--ink-900);
  text-decoration: none;
  position: relative;
  transition: color var(--dur-fast) var(--ease);
}

.nav-link::after {
  content: '';
  position: absolute;
  left: 20px;
  right: 20px;
  bottom: -2px;
  height: 3px;
  background: transparent;
  transition: background var(--dur-base) var(--ease);
}

.nav-link:hover {
  color: var(--brand-red);
}

.nav-link:hover::after,
.nav-link.active::after {
  background: var(--brand-red);
}

.nav-link.active {
  color: var(--brand-navy);
  font-weight: var(--fw-bold);
}

.nav-spacer {
  flex: 1;
}

.nav-admin {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 0 16px;
  font-size: var(--fs-meta);
  color: var(--ink-600);
  text-decoration: none;
  transition: color var(--dur-fast) var(--ease);
}

.nav-admin:hover {
  color: var(--brand-red);
}

/* ============ 移动端 ============ */
.mobile-menu-btn {
  margin-left: 10px;
}

.m-nav {
  padding: 8px 16px;
  display: flex;
  flex-direction: column;
}

.m-nav-link {
  padding: 14px 12px;
  border-bottom: 1px solid var(--line);
  font-size: var(--fs-body);
  color: var(--ink-900);
  text-decoration: none;
}

.m-nav-link:hover {
  color: var(--brand-red);
}

.m-search {
  padding: 20px 16px;
}

@media (max-width: 768px) {
  .top-bar {
    display: none;
  }
  .main-header {
    padding: 14px 0;
  }
  .header-content {
    gap: 12px;
  }
  .logo-title {
    font-size: var(--fs-h3);
  }
  .logo-seal {
    width: 44px;
    height: 44px;
    font-size: 22px;
  }
  .logo-sub {
    font-size: var(--fs-micro);
  }
}
</style>
