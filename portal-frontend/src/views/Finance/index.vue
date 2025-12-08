<template>
  <div class="finance-page">
    <div class="container">
      <h1 class="page-title">财经频道</h1>

      <!-- 市场行情 -->
      <section class="market-section">
        <el-card>
          <template #header>
            <div class="card-header">
              <el-icon color="#67C23A"><TrendCharts /></el-icon>
              <span>市场行情</span>
            </div>
          </template>
          <el-row :gutter="20">
            <el-col :xs="12" :sm="8" :md="6" v-for="index in marketData" :key="index.code">
              <div class="index-card" :class="{ 'up': index.change > 0, 'down': index.change < 0 }">
                <div class="index-name">{{ index.name }}</div>
                <div class="index-value">{{ index.value }}</div>
                <div class="index-change">
                  {{ index.change > 0 ? '+' : '' }}{{ index.change }}%
                </div>
              </div>
            </el-col>
          </el-row>
        </el-card>
      </section>

      <!-- 财经资讯 -->
      <section class="news-section">
        <el-row :gutter="20">
          <el-col :xs="24" :sm="24" :md="16">
            <h2 class="section-title">财经资讯</h2>
            <div class="article-list">
              <el-card
                v-for="article in articles"
                :key="article.id"
                class="article-card"
                shadow="hover"
                @click="goToDetail(article.id)"
              >
                <div class="article-item">
                  <div class="article-cover" v-if="article.cover">
                    <img :src="article.cover" :alt="article.title" />
                  </div>
                  <div class="article-content">
                    <h3>{{ article.title }}</h3>
                    <p>{{ article.summary }}</p>
                    <div class="article-meta">
                      <span>{{ formatTime(article.createdAt) }}</span>
                      <span>{{ article.views }} 阅读</span>
                    </div>
                  </div>
                </div>
              </el-card>
            </div>
          </el-col>

          <el-col :xs="24" :sm="24" :md="8">
            <h2 class="section-title">热门推荐</h2>
            <el-card>
              <div class="hot-list">
                <div
                  v-for="(item, index) in hotArticles"
                  :key="item.id"
                  class="hot-item"
                  @click="goToDetail(item.id)"
                >
                  <span class="rank" :class="{ 'top': index < 3 }">{{ index + 1 }}</span>
                  <span class="title">{{ item.title }}</span>
                </div>
              </div>
            </el-card>
          </el-col>
        </el-row>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { TrendCharts } from '@element-plus/icons-vue'

const router = useRouter()

const marketData = ref([
  { code: 'sh000001', name: '上证指数', value: '3245.68', change: 1.23 },
  { code: 'sz399001', name: '深证成指', value: '10876.54', change: -0.45 },
  { code: 'sz399006', name: '创业板指', value: '2234.12', change: 0.78 },
  { code: 'usd', name: '美元指数', value: '103.45', change: -0.12 }
])

import { getArticleList } from '@/api/article'

const articles = ref<any[]>([])
const hotArticles = ref<any[]>([])

const fetchData = async () => {
  try {
    // 获取财经分类的文章 (categoryId = 5)
    const result = await getArticleList({
      page: 1,
      pageSize: 10,
      categoryId: 5
    })
    articles.value = result.list || []

    // 热门文章：按浏览量排序
    const hotResult = await getArticleList({
      page: 1,
      pageSize: 8,
      categoryId: 5,
      sort: 'views'
    })
    hotArticles.value = hotResult.list || []
  } catch (error) {
    console.error('获取财经数据失败:', error)
  }
}

const formatTime = (time: string) => {
  return new Date(time).toLocaleString('zh-CN')
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="css">
.finance-page {
  min-height: 60vh;
}

.page-title {
  font-size: 28px;
  margin-bottom: 30px;
  color: #303133;
}

.market-section {
  margin-bottom: 40px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
}

.index-card {
  padding: 20px;
  background: #f5f7fa;
  border-radius: 8px;
  text-align: center;
  margin-bottom: 15px;
}

.index-card.up {
  background: #f0f9ff;
  border-left: 4px solid #67C23A;
}

.index-card.down {
  background: #fef0f0;
  border-left: 4px solid #F56C6C;
}

.index-name {
  font-size: 14px;
  color: #909399;
  margin-bottom: 8px;
}

.index-value {
  font-size: 24px;
  font-weight: bold;
  color: #303133;
  margin-bottom: 5px;
}

.index-change {
  font-size: 16px;
  font-weight: bold;
}

.index-card.up .index-change {
  color: #67C23A;
}

.index-card.down .index-change {
  color: #F56C6C;
}

.section-title {
  font-size: 22px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
  color: #303133;
}

.article-card {
  margin-bottom: 20px;
  cursor: pointer;
}

.article-item {
  display: flex;
  gap: 15px;
}

.article-cover {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.article-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.article-content {
  flex: 1;
}

.article-content h3 {
  font-size: 16px;
  margin: 0 0 10px;
  color: #303133;
}

.article-content p {
  font-size: 14px;
  color: #606266;
  margin: 0 0 10px;
  line-height: 1.6;
}

.article-meta {
  display: flex;
  gap: 15px;
  font-size: 13px;
  color: #909399;
}

.hot-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.hot-item {
  display: flex;
  gap: 10px;
  align-items: center;
  cursor: pointer;
  padding: 8px;
  border-radius: 4px;
  transition: background 0.3s;
}

.hot-item:hover {
  background: #f5f7fa;
}

.rank {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  line-height: 24px;
  text-align: center;
  background: #e4e7ed;
  color: #606266;
  border-radius: 4px;
  font-weight: bold;
}

.rank.top {
  background: linear-gradient(135deg, #f56c6c, #e6a23c);
  color: #fff;
}

.hot-item .title {
  flex: 1;
  font-size: 14px;
  color: #303133;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
