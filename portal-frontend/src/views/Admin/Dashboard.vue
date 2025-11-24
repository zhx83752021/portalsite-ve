<template>
  <div class="dashboard">
    <h1 class="page-title">控制台</h1>

    <!-- 数据统计卡片 -->
    <el-row :gutter="20" class="stats-row">
      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e7f4ff;">
              <el-icon :size="32" color="#409EFF">
                <Document />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.articles }}</div>
              <div class="stat-label">文章总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #e8f9f0;">
              <el-icon :size="32" color="#67C23A">
                <User />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.users }}</div>
              <div class="stat-label">用户总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff4e6;">
              <el-icon :size="32" color="#E6A23C">
                <ChatDotRound />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.comments }}</div>
              <div class="stat-label">评论总数</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :sm="12" :md="6">
        <el-card class="stat-card">
          <div class="stat-content">
            <div class="stat-icon" style="background: #fff0f0;">
              <el-icon :size="32" color="#F56C6C">
                <View />
              </el-icon>
            </div>
            <div class="stat-info">
              <div class="stat-value">{{ stats.views }}</div>
              <div class="stat-label">访问总数</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- 快捷操作 -->
    <el-card class="quick-actions" header="快捷操作">
      <el-row :gutter="20">
        <el-col :xs="12" :sm="8" :md="6" v-for="action in quickActions" :key="action.name">
          <div class="action-item" @click="handleAction(action.route)">
            <el-icon :size="28" :color="action.color">
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
        <el-card header="最新文章">
          <el-empty v-if="recentArticles.length === 0" description="暂无数据" />
          <div v-else class="activity-list">
            <div class="activity-item" v-for="article in recentArticles" :key="article.id">
              <div class="activity-title">{{ article.title }}</div>
              <div class="activity-time">{{ article.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12">
        <el-card header="最新评论">
          <el-empty v-if="recentComments.length === 0" description="暂无数据" />
          <div v-else class="activity-list">
            <div class="activity-item" v-for="comment in recentComments" :key="comment.id">
              <div class="activity-title">{{ comment.content }}</div>
              <div class="activity-time">{{ comment.time }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import {
  Document,
  User,
  ChatDotRound,
  View,
  Plus,
  Setting,
  Collection,
  Edit
} from '@element-plus/icons-vue'

const router = useRouter()

// 统计数据
const stats = reactive({
  articles: 128,
  users: 1024,
  comments: 356,
  views: 12580
})

// 快捷操作
const quickActions = [
  { name: '新建文章', icon: Plus, color: '#409EFF', route: '/admin/articles/create' },
  { name: '文章管理', icon: Document, color: '#67C23A', route: '/admin/articles' },
  { name: '用户管理', icon: User, color: '#E6A23C', route: '/admin/users' },
  { name: '评论管理', icon: ChatDotRound, color: '#F56C6C', route: '/admin/comments' },
  { name: '分类管理', icon: Collection, color: '#909399', route: '/admin/categories' },
  { name: '系统设置', icon: Setting, color: '#606266', route: '/admin/settings' }
]

// 最新文章
const recentArticles = ref([
  { id: 1, title: '门户网站功能需求分析', time: '2024-11-24 10:30' },
  { id: 2, title: 'Vue 3最佳实践指南', time: '2024-11-24 09:15' },
  { id: 3, title: 'TypeScript开发技巧', time: '2024-11-23 16:45' }
])

// 最新评论
const recentComments = ref([
  { id: 1, content: '这篇文章写得很好！', time: '2024-11-24 11:20' },
  { id: 2, content: '感谢分享，很有帮助', time: '2024-11-24 10:05' },
  { id: 3, content: '期待更多优质内容', time: '2024-11-23 18:30' }
])

const handleAction = (route: string) => {
  router.push(route)
}
</script>

<style scoped lang="css">
.dashboard {
  padding: 0;
}

.page-title {
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.stats-row {
  margin-bottom: 20px;
}

.stat-card {
  cursor: pointer;
  transition: all 0.3s;
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.stat-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  border-radius: 8px;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 14px;
  color: #909399;
}

.quick-actions {
  margin-bottom: 20px;
}

.action-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.3s;
}

.action-item:hover {
  background-color: #f5f7fa;
  transform: translateY(-2px);
}

.action-name {
  margin-top: 8px;
  font-size: 14px;
  color: #606266;
}

.activity-list {
  max-height: 300px;
  overflow-y: auto;
}

.activity-item {
  padding: 12px 0;
  border-bottom: 1px solid #f0f0f0;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-title {
  font-size: 14px;
  color: #303133;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.activity-time {
  font-size: 12px;
  color: #909399;
}

/* 响应式布局 */
@media (max-width: 768px) {
  .stats-row :deep(.el-col) {
    margin-bottom: 12px;
  }

  .quick-actions :deep(.el-col) {
    margin-bottom: 12px;
  }
}
</style>
