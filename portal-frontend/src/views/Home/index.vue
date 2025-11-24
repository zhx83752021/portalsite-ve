<template>
  <div class="home-page">
    <div class="container">
      <!-- 焦点图轮播 -->
      <section class="hero-section">
        <el-carousel height="400px" :interval="5000">
          <el-carousel-item v-for="item in bannerList" :key="item.id">
            <div class="carousel-item" :style="{ backgroundImage: `url(${item.cover})` }">
              <div class="carousel-content">
                <h2>{{ item.title }}</h2>
                <p>{{ item.summary }}</p>
                <el-button type="primary" size="large" @click="goToDetail(item.id)">
                  阅读全文
                </el-button>
              </div>
            </div>
          </el-carousel-item>
        </el-carousel>
      </section>

      <!-- 快捷导航 -->
      <section class="quick-nav-section">
        <div class="section-title">
          <h2><el-icon>
              <Grid />
            </el-icon> 频道导航</h2>
          <p>精选频道，一键直达</p>
        </div>
        <div class="channel-grid">
          <div v-for="channel in channels" :key="channel.id" class="channel-card" @click="goToChannel(channel.path)">
            <div class="channel-icon" :style="{ background: channel.gradient }">
              <el-icon :size="36">
                <component :is="channel.icon" />
              </el-icon>
            </div>
            <div class="channel-info">
              <h3>{{ channel.name }}</h3>
              <p>{{ channel.description }}</p>
            </div>
            <div class="channel-arrow">
              <el-icon>
                <ArrowRight />
              </el-icon>
            </div>
          </div>
        </div>
      </section>

      <!-- 新闻列表区 -->
      <section class="news-section">
        <el-row :gutter="20">
          <!-- 热点新闻 -->
          <el-col :xs="24" :sm="24" :md="16">
            <div class="section-header">
              <h2>热点新闻</h2>
              <router-link to="/news" class="more-link">更多 →</router-link>
            </div>
            <div class="news-list">
              <div v-for="article in hotNews" :key="article.id" class="news-item" @click="goToDetail(article.id)">
                <div class="news-cover" v-if="article.cover">
                  <img :src="article.cover" :alt="article.title" />
                </div>
                <div class="news-content">
                  <h3 class="news-title">{{ article.title }}</h3>
                  <p class="news-summary">{{ article.summary }}</p>
                  <div class="news-meta">
                    <span><el-icon>
                        <Clock />
                      </el-icon> {{ formatTime(article.createdAt) }}</span>
                    <span><el-icon>
                        <View />
                      </el-icon> {{ article.views }}</span>
                    <el-tag size="small" v-if="article.categoryName">{{ article.categoryName }}</el-tag>
                  </div>
                </div>
              </div>
            </div>
          </el-col>

          <!-- 推荐内容 -->
          <el-col :xs="24" :sm="24" :md="8">
            <div class="section-header">
              <h2>推荐阅读</h2>
            </div>
            <div class="recommend-list">
              <div v-for="(article, index) in recommendNews" :key="article.id" class="recommend-item"
                @click="goToDetail(article.id)">
                <span class="rank" :class="{ 'top': index < 3 }">{{ index + 1 }}</span>
                <div class="recommend-content">
                  <h4>{{ article.title }}</h4>
                  <div class="meta">
                    <span>{{ article.views }} 阅读</span>
                  </div>
                </div>
              </div>
            </div>
          </el-col>
        </el-row>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList, getHotArticles, getRecommendArticles } from '@/api/article'
import type { Article } from '@/api/article'
import { Clock, View, Document, TrendCharts, Trophy, VideoPlay, Monitor, Reading, Grid, ArrowRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()

const bannerList = ref<Article[]>([])
const hotNews = ref<Article[]>([])
const recommendNews = ref<Article[]>([])

const channels = [
  {
    id: 1,
    name: '新闻中心',
    path: '/news',
    icon: Document,
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '实时追踪热点资讯'
  },
  {
    id: 2,
    name: '财经资讯',
    path: '/finance',
    icon: TrendCharts,
    gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    description: '掌握市场脉动'
  },
  {
    id: 3,
    name: '体育赛事',
    path: '/sports',
    icon: Trophy,
    gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    description: '精彩赛事直播'
  },
  {
    id: 4,
    name: '娱乐八卦',
    path: '/entertainment',
    icon: VideoPlay,
    gradient: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    description: '明星动态八卦'
  },
  {
    id: 5,
    name: '科技前沿',
    path: '/tech',
    icon: Monitor,
    gradient: 'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    description: '探索科技未来'
  },
  {
    id: 6,
    name: '更多频道',
    path: '/news',
    icon: Reading,
    gradient: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    description: '发现更多精彩'
  }
]

const fetchData = async () => {
  try {
    // 获取轮播图数据（使用热门文章的前3条）
    const bannerData = await getHotArticles(3)
    bannerList.value = bannerData || []

    // 获取热点新闻
    const hotData = await getHotArticles(8)
    hotNews.value = hotData || []

    // 获取推荐内容
    const recommendData = await getRecommendArticles(10)
    recommendNews.value = recommendData || []
  } catch (error) {
    console.error('获取数据失败:', error)
    // 如果API失败，使用模拟数据
    useMockData()
  }
}

const useMockData = () => {
  // 模拟数据用于开发演示
  const mockArticle = (id: number, categoryId: number = 1): Article => ({
    id,
    title: `这是第${id}条新闻标题 - 重大事件发生，引发广泛关注`,
    content: '新闻正文内容...',
    summary: '这是新闻摘要，简要介绍新闻的主要内容和核心观点，吸引读者点击阅读全文。',
    cover: `https://picsum.photos/800/400?random=${id}`,
    categoryId,
    categoryName: ['头条', '财经', '体育', '娱乐', '科技'][categoryId - 1],
    authorId: 1,
    authorName: '编辑' + id,
    views: Math.floor(Math.random() * 10000),
    status: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  })

  bannerList.value = [1, 2, 3].map(i => mockArticle(i))
  hotNews.value = Array.from({ length: 8 }, (_, i) => mockArticle(i + 4, (i % 5) + 1))
  recommendNews.value = Array.from({ length: 10 }, (_, i) => mockArticle(i + 12))
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

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

const goToChannel = (path: string) => {
  router.push(path)
}

onMounted(() => {
  fetchData()
})
</script>

<style scoped lang="css">
.home-page {
  padding-bottom: 40px;
}

.hero-section {
  margin-bottom: 40px;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.carousel-item {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
  position: relative;
}

.carousel-item::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.7));
}

.carousel-content {
  position: absolute;
  bottom: 40px;
  left: 40px;
  right: 40px;
  color: #fff;
  z-index: 1;
}

.carousel-content h2 {
  font-size: 32px;
  margin-bottom: 15px;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.carousel-content p {
  font-size: 16px;
  margin-bottom: 20px;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
}

.quick-nav-section {
  margin-bottom: 40px;
}

.section-title {
  text-align: center;
  margin-bottom: 30px;
}

.section-title h2 {
  font-size: 28px;
  color: #303133;
  margin: 0 0 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
}

.section-title p {
  font-size: 14px;
  color: #909399;
  margin: 0;
}

.channel-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;
}

.channel-card {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  display: flex;
  align-items: center;
  gap: 16px;
  border: 2px solid transparent;
}

.channel-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  border-color: #667eea;
}

.channel-icon {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.channel-info {
  flex: 1;
}

.channel-info h3 {
  margin: 0 0 6px;
  font-size: 18px;
  font-weight: 600;
  color: #303133;
}

.channel-info p {
  font-size: 13px;
  color: #909399;
  margin: 0;
  line-height: 1.4;
}

.channel-arrow {
  color: #c0c4cc;
  transition: all 0.3s;
}

.channel-card:hover .channel-arrow {
  color: #667eea;
  transform: translateX(4px);
}

.news-section {
  margin-top: 40px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #409EFF;
}

.section-header h2 {
  font-size: 24px;
  color: #303133;
  margin: 0;
}

.more-link {
  color: #409EFF;
  text-decoration: none;
  font-size: 14px;
}

.more-link:hover {
  color: #66b1ff;
}

.news-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.news-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.3s;
}

.news-item:last-child {
  border-bottom: none;
}

.news-item:hover {
  background: #f5f7fa;
}

.news-cover {
  flex-shrink: 0;
  width: 180px;
  height: 120px;
  border-radius: 4px;
  overflow: hidden;
}

.news-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.news-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.news-title {
  font-size: 18px;
  color: #303133;
  margin: 0 0 10px;
  line-height: 1.4;
}

.news-summary {
  font-size: 14px;
  color: #606266;
  margin: 0 0 10px;
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.news-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  color: #909399;
}

.news-meta span {
  display: flex;
  align-items: center;
  gap: 4px;
}

.recommend-list {
  background: #fff;
  border-radius: 8px;
  padding: 20px;
}

.recommend-item {
  display: flex;
  gap: 15px;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  cursor: pointer;
  transition: background 0.3s;
}

.recommend-item:last-child {
  border-bottom: none;
}

.recommend-item:hover {
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

.recommend-content {
  flex: 1;
}

.recommend-content h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 8px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.recommend-content .meta {
  font-size: 12px;
  color: #909399;
}

@media (max-width: 768px) {
  .carousel-content {
    bottom: 20px;
    left: 20px;
    right: 20px;
  }

  .carousel-content h2 {
    font-size: 20px;
  }

  .carousel-content p {
    font-size: 14px;
  }

  .channel-grid {
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
  }

  .channel-card {
    padding: 20px 10px;
  }

  .news-item {
    flex-direction: column;
  }

  .news-cover {
    width: 100%;
    height: 200px;
  }

  .section-header h2 {
    font-size: 20px;
  }
}

@media (max-width: 480px) {
  .channel-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
