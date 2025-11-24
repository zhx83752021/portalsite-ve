<template>
  <div class="entertainment-page">
    <div class="container">
      <h1 class="page-title">娱乐频道</h1>
      <div class="article-grid">
        <el-card v-for="article in articles" :key="article.id" class="article-card" shadow="hover" @click="goToDetail(article.id)">
          <img :src="article.cover" class="article-image" />
          <div class="article-info">
            <h3>{{ article.title }}</h3>
            <p>{{ article.summary }}</p>
          </div>
        </el-card>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const articles = ref<any[]>([])

const fetchData = () => {
  articles.value = Array.from({ length: 12 }, (_, i) => ({
    id: i + 1,
    title: `娱乐资讯 ${i + 1}`,
    summary: '最新娱乐八卦，明星动态一网打尽',
    cover: `https://picsum.photos/300/200?random=${i + 300}`
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
.entertainment-page {
  min-height: 60vh;
}

.page-title {
  font-size: 28px;
  margin-bottom: 30px;
}

.article-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.article-card {
  cursor: pointer;
  transition: transform 0.3s;
}

.article-card:hover {
  transform: translateY(-5px);
}

.article-image {
  width: 100%;
  height: 180px;
  object-fit: cover;
}

.article-info {
  padding: 15px 0;
}

.article-info h3 {
  font-size: 16px;
  margin: 0 0 10px;
}

.article-info p {
  font-size: 14px;
  color: #606266;
  margin: 0;
}
</style>
