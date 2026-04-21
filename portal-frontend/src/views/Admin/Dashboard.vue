<template>
  <div class="dashboard">
    <header class="page-header">
      <div>
        <div class="eyebrow">控制台 · CONSOLE</div>
        <h1 class="page-title">内容运营总览</h1>
        <p class="page-sub">{{ todayLabel }}&nbsp;·&nbsp;实时数据</p>
      </div>
      <div class="header-actions">
        <el-button type="primary" @click="handleAction('/admin/articles/create')">
          <el-icon><Plus /></el-icon>
          <span>发布新稿</span>
        </el-button>
      </div>
    </header>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card tone-navy" shadow="never">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="28"><Document /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.articles }}</div>
              <div class="stat-label">文章总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card tone-teal" shadow="never">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="28"><User /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.users }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card tone-gold" shadow="never">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="28"><ChatDotRound /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.comments }}</div>
              <div class="stat-label">评论总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card tone-red" shadow="never">
          <div class="stat-content">
            <div class="stat-icon">
              <el-icon :size="28"><View /></el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ formatNumber(stats.views) }}</div>
              <div class="stat-label">访问总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="quick-actions section-card" shadow="never">
      <template #header>
        <div class="section-card__header">
          <h3>快捷操作</h3>
          <span class="section-card__sub">QUICK&nbsp;ACTIONS</span>
        </div>
      </template>
      <el-row :gutter="16">
        <el-col :xs="12" :sm="8" :md="4" v-for="action in quickActions" :key="action.name">
          <div class="action-item" @click="handleAction(action.route)">
            <el-icon :size="24">
              <component :is="action.icon" />
            </el-icon>
            <div class="action-name">{{ action.name }}</div>
          </div>
        </el-col>
      </el-row>
    </el-card>

    <!-- 最近活动 -->
    <el-row :gutter="20">
      <el-col :xs="24" :md="12">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-card__header">
              <h3>最新文章</h3>
              <router-link to="/admin/articles" class="section-card__link">查看全部</router-link>
            </div>
          </template>
          <el-empty v-if="recentArticles.length === 0" description="暂无数据" />
          <div v-else class="activity-list">
            <div class="activity-item" v-for="article in recentArticles" :key="article.id">
              <div class="activity-dot" aria-hidden="true"></div>
              <div class="activity-body">
                <div class="activity-title">{{ article.title }}</div>
                <div class="activity-time">{{ article.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card class="section-card" shadow="never">
          <template #header>
            <div class="section-card__header">
              <h3>最新评论</h3>
              <router-link to="/admin/comments" class="section-card__link">查看全部</router-link>
            </div>
          </template>
          <el-empty v-if="recentComments.length === 0" description="暂无数据" />
          <div v-else class="activity-list">
            <div class="activity-item" v-for="comment in recentComments" :key="comment.id">
              <div class="activity-dot" aria-hidden="true"></div>
              <div class="activity-body">
                <div class="activity-title">{{ comment.content }}</div>
                <div class="activity-time">{{ comment.time }}</div>
              </div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document,
  User,
  ChatDotRound,
  View,
  Plus,
  Setting,
  Collection,
} from '@element-plus/icons-vue'
import { getAdminStats } from '@/api/admin'

const router = useRouter()

const stats = reactive({
  articles: 0,
  users: 0,
  comments: 0,
  views: 0
})

const quickActions = [
  { name: '新建文章', icon: Plus, route: '/admin/articles/create' },
  { name: '文章管理', icon: Document, route: '/admin/articles' },
  { name: '用户管理', icon: User, route: '/admin/users' },
  { name: '评论管理', icon: ChatDotRound, route: '/admin/comments' },
  { name: '分类管理', icon: Collection, route: '/admin/categories' },
  { name: '系统设置', icon: Setting, route: '/admin/settings' }
]

interface DashRecentArticle { id: number; title: string; time: string }
interface DashRecentComment { id: number; content: string; time: string }
const recentArticles = ref<DashRecentArticle[]>([])
const recentComments = ref<DashRecentComment[]>([])

const fmtTime = (iso?: string) => {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

const loadStats = async () => {
  try {
    const data = await getAdminStats()
    stats.articles = data.stats.articles
    stats.users = data.stats.users
    stats.comments = data.stats.comments
    stats.views = data.stats.views
    recentArticles.value = data.recentArticles.map(a => ({ ...a, time: fmtTime(a.time) }))
    recentComments.value = data.recentComments.map(c => ({ id: c.id, content: c.content, time: fmtTime(c.time) }))
  } catch (err) {
    console.error('加载控制台统计失败', err)
  }
}

onMounted(loadStats)

const todayLabel = computed(() => {
  const d = new Date()
  return `${d.getFullYear()} 年 ${d.getMonth() + 1} 月 ${d.getDate()} 日`
})

const formatNumber = (n: number) => n.toLocaleString('zh-CN')

const handleAction = (route: string) => {
  router.push(route)
}
</script>

<style scoped lang="css">
.dashboard {
  padding: 0;
  color: var(--ink-800);
}

.page-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  margin-bottom: 24px;
  padding-bottom: 18px;
  border-bottom: 1px solid var(--line-200);
}

.eyebrow {
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  color: var(--brand-red);
  text-transform: uppercase;
  font-family: var(--font-en);
  font-weight: var(--fw-semibold);
  margin-bottom: 6px;
}

.page-title {
  margin: 0;
  font-size: 26px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  font-family: var(--font-display);
  letter-spacing: 0.01em;
}

.page-sub {
  margin: 6px 0 0;
  font-size: 13px;
  color: var(--ink-500);
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.25s ease;
  border: 1px solid var(--line-200);
  border-radius: var(--radius-md);
  background: #fff;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 3px;
  height: 100%;
  background: var(--brand-navy);
}

.stat-card.tone-navy::before { background: var(--brand-navy); }
.stat-card.tone-red::before { background: var(--brand-red); }
.stat-card.tone-gold::before { background: var(--brand-gold); }
.stat-card.tone-teal::before { background: #0f766e; }

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--shadow-md);
  border-color: transparent;
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 14px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-sm);
  background: var(--mist-50);
  color: var(--brand-navy);
}

.stat-card.tone-red .stat-icon { background: rgba(197, 32, 44, 0.08); color: var(--brand-red); }
.stat-card.tone-gold .stat-icon { background: rgba(212, 175, 55, 0.12); color: #a88a1f; }
.stat-card.tone-teal .stat-icon { background: rgba(15, 118, 110, 0.1); color: #0f766e; }

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin-bottom: 2px;
  font-family: var(--font-display);
  line-height: 1.1;
}

.stat-label {
  font-size: 13px;
  color: var(--ink-500);
}

.stat-trend {
  margin-top: 12px;
  padding-top: 10px;
  border-top: 1px dashed var(--line-200);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: var(--fs-meta);
  color: var(--ink-500);
}

.stat-trend.positive { color: #0f766e; }
.stat-trend.negative { color: var(--brand-red); }

.section-card {
  margin-bottom: 20px;
  border: 1px solid var(--line-200);
  border-radius: var(--radius-md);
  background: #fff;
}

.section-card :deep(.el-card__header) {
  padding: 16px 20px;
  border-bottom: 1px solid var(--line-200);
}

.section-card__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
}

.section-card__header h3 {
  margin: 0;
  font-size: 15px;
  font-weight: var(--fw-semibold);
  color: var(--ink-900);
  position: relative;
  padding-left: 12px;
}

.section-card__header h3::before {
  content: '';
  position: absolute;
  left: 0;
  top: 2px;
  bottom: 2px;
  width: 3px;
  background: var(--brand-red);
}

.section-card__sub {
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  color: var(--ink-400);
  font-family: var(--font-en);
}

.section-card__link {
  font-size: var(--fs-meta);
  color: var(--ink-500);
  text-decoration: none;
  transition: color 0.2s;
}

.section-card__link:hover {
  color: var(--brand-red);
}

.quick-actions {
  margin-bottom: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 18px 8px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  border: 1px solid var(--line-200);
  background: var(--mist-50);
  transition: all 0.2s ease;
  color: var(--brand-navy);
  margin-bottom: 12px;
}

.action-item:hover {
  background-color: #fff;
  border-color: var(--brand-navy);
  color: var(--brand-red);
  transform: translateY(-2px);
  box-shadow: var(--shadow-sm);
}

.action-name {
  margin-top: 8px;
  font-size: 13px;
  color: var(--ink-700);
  font-weight: var(--fw-medium);
}

.activity-list {
  max-height: 320px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px dashed var(--line-200);
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-red);
  margin-top: 8px;
  flex-shrink: 0;
}

.activity-body {
  flex: 1;
  min-width: 0;
}

.activity-title {
  font-size: 14px;
  color: var(--ink-800);
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.5;
}

.activity-time {
  font-size: var(--fs-meta);
  color: var(--ink-500);
  font-family: var(--font-en);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .page-title {
    font-size: 22px;
  }

  .stats-row :deep(.el-col) {
    margin-bottom: 12px;
  }

  .quick-actions :deep(.el-col) {
    margin-bottom: 12px;
  }
}
</style>
