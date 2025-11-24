<template>
  <div class="news-page">
    <div class="container">
      <el-row :gutter="20">
        <!-- 左侧文章列表 -->
        <el-col :xs="24" :sm="24" :md="18">
          <!-- 分类导航 -->
          <div class="category-nav">
            <el-tag
              v-for="cat in categories"
              :key="cat.id"
              :type="selectedCategory === cat.id ? 'primary' : 'info'"
              effect="plain"
              size="large"
              @click="selectCategory(cat.id)"
              style="cursor: pointer; margin-right: 10px; margin-bottom: 10px;"
            >
              {{ cat.name }}
            </el-tag>
          </div>

          <!-- 文章列表 -->
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
                  <p class="summary">{{ article.summary }}</p>
                  <div class="article-meta">
                    <span><el-icon><User /></el-icon> {{ article.authorName }}</span>
                    <span><el-icon><Clock /></el-icon> {{ formatTime(article.createdAt) }}</span>
                    <span><el-icon><View /></el-icon> {{ article.views }}</span>
                    <el-tag size="small" v-if="article.categoryName">{{ article.categoryName }}</el-tag>
                  </div>
                </div>
              </div>
            </el-card>

            <!-- 空状态 -->
            <el-empty v-if="articles.length === 0" description="暂无文章" />

            <!-- 分页 -->
            <div class="pagination">
              <el-pagination
                v-model:current-page="currentPage"
                v-model:page-size="pageSize"
                :page-sizes="[10, 20, 30, 50]"
                :total="total"
                layout="total, sizes, prev, pager, next, jumper"
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
              />
            </div>
          </div>
        </el-col>

        <!-- 右侧边栏 -->
        <el-col :xs="24" :sm="24" :md="6">
          <!-- 搜索 -->
          <el-card class="sidebar-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <span>搜索文章</span>
              </div>
            </template>
            <el-input
              v-model="searchKeyword"
              placeholder="输入关键词搜索..."
              :prefix-icon="Search"
              @keyup.enter="handleSearch"
            >
              <template #append>
                <el-button :icon="Search" @click="handleSearch" />
              </template>
            </el-input>
          </el-card>

          <!-- 热门文章 -->
          <el-card class="sidebar-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon color="#f56c6c"><TrendCharts /></el-icon>
                <span>热门文章</span>
              </div>
            </template>
            <div class="hot-list">
              <div
                v-for="(article, index) in hotArticles"
                :key="article.id"
                class="hot-item"
                @click="goToDetail(article.id)"
              >
                <span class="rank" :class="{ 'top': index < 3 }">{{ index + 1 }}</span>
                <span class="title">{{ article.title }}</span>
              </div>
            </div>
          </el-card>

          <!-- 标签云 -->
          <el-card class="sidebar-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon color="#409EFF"><Collection /></el-icon>
                <span>热门标签</span>
              </div>
            </template>
            <div class="tag-cloud">
              <el-tag
                v-for="tag in tags"
                :key="tag"
                size="small"
                style="margin: 5px; cursor: pointer;"
                @click="searchByTag(tag)"
              >
                {{ tag }}
              </el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticleList, getHotArticles } from '@/api/article'
import { getCategoryList } from '@/api/category'
import type { Article } from '@/api/article'
import type { Category } from '@/api/category'
import { Search, User, Clock, View, TrendCharts, Collection } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()

const articles = ref<Article[]>([])
const hotArticles = ref<Article[]>([])
const categories = ref<Category[]>([{ id: 0, name: '全部', slug: 'all' }])
const tags = ref<string[]>([])

const selectedCategory = ref<number>(0)
const searchKeyword = ref<string>('')
const currentPage = ref<number>(1)
const pageSize = ref<number>(20)
const total = ref<number>(0)

const fetchCategories = async () => {
  try {
    const data = await getCategoryList()
    categories.value = [{ id: 0, name: '全部', slug: 'all' }, ...data]
  } catch (error) {
    // 使用模拟数据
    categories.value = [
      { id: 0, name: '全部', slug: 'all' },
      { id: 1, name: '时政', slug: 'politics' },
      { id: 2, name: '社会', slug: 'society' },
      { id: 3, name: '国际', slug: 'international' },
      { id: 4, name: '军事', slug: 'military' }
    ]
  }
}

const fetchArticles = async () => {
  try {
    const params = {
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryId: selectedCategory.value || undefined,
      keyword: searchKeyword.value || undefined
    }
    const data = await getArticleList(params)
    articles.value = data.list
    total.value = data.total
  } catch (error) {
    // 使用模拟数据
    useMockArticles()
  }
}

const fetchHotArticles = async () => {
  try {
    const data = await getHotArticles(10)
    hotArticles.value = data
  } catch (error) {
    // 使用模拟数据
    hotArticles.value = Array.from({ length: 10 }, (_, i) => ({
      id: i + 100,
      title: `热门文章标题 ${i + 1}`,
      content: '',
      summary: '',
      categoryId: 1,
      authorId: 1,
      views: 10000 - i * 500,
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }
}

const useMockArticles = () => {
  const mockList = Array.from({ length: pageSize.value }, (_, i) => ({
    id: i + 1,
    title: `新闻标题 ${i + 1} - 这是一个很长的标题用于展示效果`,
    content: '新闻正文内容...',
    summary: '这是新闻摘要，简要介绍新闻的主要内容和核心观点，吸引读者点击阅读全文。',
    cover: i % 3 === 0 ? `https://picsum.photos/400/250?random=${i}` : undefined,
    categoryId: (i % 4) + 1,
    categoryName: ['时政', '社会', '国际', '军事'][i % 4],
    authorId: 1,
    authorName: '编辑' + (i % 5 + 1),
    views: Math.floor(Math.random() * 10000),
    status: 1,
    createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
    updatedAt: new Date().toISOString(),
    tags: ['标签1', '标签2', '标签3'].slice(0, Math.floor(Math.random() * 3) + 1)
  }))
  articles.value = mockList
  total.value = 100

  // 收集所有标签
  const allTags = new Set<string>()
  mockList.forEach(article => {
    article.tags?.forEach(tag => allTags.add(tag))
  })
  tags.value = Array.from(allTags)
}

const formatTime = (time: string) => {
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 3600000) {
    return Math.floor(diff / 60000) + '分钟前'
  } else if (diff < 86400000) {
    return Math.floor(diff / 3600000) + '小时前'
  } else if (diff < 604800000) {
    return Math.floor(diff / 86400000) + '天前'
  } else {
    return date.toLocaleDateString()
  }
}

const selectCategory = (categoryId: number) => {
  selectedCategory.value = categoryId
  currentPage.value = 1
  fetchArticles()
}

const handleSearch = () => {
  currentPage.value = 1
  fetchArticles()
}

const searchByTag = (tag: string) => {
  searchKeyword.value = tag
  handleSearch()
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

const handleSizeChange = (val: number) => {
  pageSize.value = val
  fetchArticles()
}

const handleCurrentChange = (val: number) => {
  currentPage.value = val
  fetchArticles()
}

onMounted(() => {
  // 从路由查询参数获取关键词
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword as string
  }

  fetchCategories()
  fetchArticles()
  fetchHotArticles()
})

watch(() => route.query, () => {
  if (route.query.keyword) {
    searchKeyword.value = route.query.keyword as string
    handleSearch()
  }
})
</script>

<style scoped lang="css">
.news-page {
  min-height: 60vh;
}

.category-nav {
  background: #fff;
  padding: 20px;
  margin-bottom: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.article-list {
  min-height: 500px;
}

.article-card {
  margin-bottom: 20px;
  cursor: pointer;
  transition: all 0.3s;
}

.article-card:hover {
  transform: translateY(-2px);
}

.article-item {
  display: flex;
  gap: 20px;
}

.article-cover {
  flex-shrink: 0;
  width: 200px;
  height: 140px;
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
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.article-content h3 {
  font-size: 18px;
  color: #303133;
  margin: 0 0 10px;
  line-height: 1.4;
}

.summary {
  font-size: 14px;
  color: #606266;
  margin: 0 0 auto;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.article-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  color: #909399;
  margin-top: 10px;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.pagination {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  padding: 20px 0;
}

.sidebar-card {
  margin-bottom: 20px;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: bold;
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
  font-size: 14px;
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

.tag-cloud {
  display: flex;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .article-item {
    flex-direction: column;
  }

  .article-cover {
    width: 100%;
    height: 200px;
  }

  .pagination :deep(.el-pagination) {
    justify-content: center;
    flex-wrap: wrap;
  }
}
</style>
