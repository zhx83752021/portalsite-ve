<template>
  <div class="tech-page">
    <div class="container">
      <h1 class="page-title">科技频道</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <div class="article-list">
            <el-card v-for="article in articles" :key="article.id" class="article-card" shadow="hover" @click="goToDetail(article.id)">
              <div class="article-item">
                <div class="article-cover">
                  <img :src="article.cover" :alt="article.title" />
                </div>
                <div class="article-content">
                  <h3>{{ article.title }}</h3>
                  <p>{{ article.summary }}</p>
                </div>
              </div>
            </el-card>
          </div>
        </el-col>
        <el-col :xs="24" :md="8">
          <h2 class="section-title">科技热点</h2>
          <el-card>
            <div class="hot-topics">
              <el-tag v-for="topic in topics" :key="topic" size="large" style="margin: 5px">{{ topic }}</el-tag>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/article'

const router = useRouter()
const articles = ref<any[]>([])
const topics = ref(['AI', '5G', '云计算', '物联网', '区块链', '量子计算', '元宇宙', '自动驾驶'])

const fetchData = async () => {
  try {
    // 获取科技分类的文章 (categoryId = 8)
    const result = await getArticleList({
      page: 1,
      pageSize: 10,
      categoryId: 8
    })
    articles.value = result.list || []
  } catch (error) {
    console.error('获取科技数据失败:', error)
  }
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="css">
.tech-page {
  min-height: 60vh;
}

.page-title {
  font-size: 28px;
  margin-bottom: 30px;
}

.section-title {
  font-size: 22px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
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

.article-content h3 {
  font-size: 16px;
  margin: 0 0 10px;
}

.article-content p {
  font-size: 14px;
  color: #606266;
}

.hot-topics {
  display: flex;
  flex-wrap: wrap;
}
</style>
