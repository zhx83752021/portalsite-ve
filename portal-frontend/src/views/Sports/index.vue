<template>
  <div class="sports-page">
    <div class="container">
      <h1 class="page-title">体育频道</h1>
      <el-row :gutter="20">
        <el-col :xs="24" :md="16">
          <h2 class="section-title">体育资讯</h2>
          <div class="article-list">
            <el-card v-for="article in articles" :key="article.id" class="article-card" shadow="hover" @click="goToDetail(article.id)">
              <div class="article-item">
                <div class="article-cover" v-if="article.cover">
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
          <h2 class="section-title">热门赛事</h2>
          <el-card>
            <div class="match-list">
              <div v-for="match in matches" :key="match.id" class="match-item">
                <div class="match-teams">{{ match.home }} vs {{ match.away }}</div>
                <div class="match-time">{{ match.time }}</div>
              </div>
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
const matches = ref<any[]>([])

const fetchData = async () => {
  try {
    // 获取体育分类的文章 (categoryId = 6)
    const result = await getArticleList({
      page: 1,
      pageSize: 10,
      categoryId: 6
    })
    articles.value = result.list || []
  } catch (error) {
    console.error('获取体育数据失败:', error)
  }

  matches.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    home: ['湖人', '勇士', '热火', '雄鹿', '凯尔特人'][i],
    away: ['快船', '火箭', '魔术', '公牛', '76人'][i],
    time: '今天 20:00'
  }))
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="css">
.sports-page {
  min-height: 60vh;
}

.page-title {
  font-size: 28px;
  margin-bottom: 30px;
  color: #303133;
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

.match-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.match-item {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.match-teams {
  font-weight: bold;
  margin-bottom: 8px;
}

.match-time {
  font-size: 13px;
  color: #909399;
}
</style>
