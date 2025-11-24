<template>
  <div class="article-detail">
    <div class="container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="24" :md="18">
          <el-card v-loading="loading">
            <article class="article-content">
              <!-- 文章头部 -->
              <header class="article-header">
                <h1>{{ article.title }}</h1>
                <div class="article-meta">
                  <span><el-icon><User /></el-icon> {{ article.authorName }}</span>
                  <span><el-icon><Clock /></el-icon> {{ formatTime(article.createdAt) }}</span>
                  <span><el-icon><View /></el-icon> {{ article.views }} 阅读</span>
                  <el-tag v-if="article.categoryName">{{ article.categoryName }}</el-tag>
                </div>
              </header>

              <!-- 文章封面 -->
              <div class="article-cover" v-if="article.cover">
                <img :src="article.cover" :alt="article.title" />
              </div>

              <!-- 文章摘要 -->
              <div class="article-summary" v-if="article.summary">
                <p>{{ article.summary }}</p>
              </div>

              <!-- 文章正文 -->
              <div class="article-body" v-html="article.content"></div>

              <!-- 文章标签 -->
              <div class="article-tags" v-if="article.tags && article.tags.length">
                <el-tag
                  v-for="tag in article.tags"
                  :key="tag"
                  size="small"
                  style="margin-right: 8px;"
                >
                  {{ tag }}
                </el-tag>
              </div>

              <!-- 文章操作 -->
              <div class="article-actions">
                <el-button :icon="Star" @click="handleFavorite">
                  {{ isFavorited ? '已收藏' : '收藏' }}
                </el-button>
                <el-button :icon="Share" @click="handleShare">分享</el-button>
              </div>
            </article>

            <!-- 评论区 -->
            <div class="comment-section">
              <h3>评论 ({{ comments.length }})</h3>

              <!-- 发表评论 -->
              <div class="comment-form" v-if="isLoggedIn">
                <el-input
                  v-model="commentContent"
                  type="textarea"
                  :rows="4"
                  placeholder="发表你的看法..."
                  maxlength="500"
                  show-word-limit
                />
                <el-button type="primary" @click="submitComment" :loading="submitting">
                  发表评论
                </el-button>
              </div>
              <div class="comment-login-tip" v-else>
                <el-alert type="info" :closable="false">
                  请先 <router-link to="/login">登录</router-link> 后发表评论
                </el-alert>
              </div>

              <!-- 评论列表 -->
              <div class="comment-list">
                <div v-for="comment in comments" :key="comment.id" class="comment-item">
                  <el-avatar :src="comment.userAvatar">{{ comment.username?.charAt(0) }}</el-avatar>
                  <div class="comment-content">
                    <div class="comment-user">{{ comment.username }}</div>
                    <div class="comment-text">{{ comment.content }}</div>
                    <div class="comment-meta">
                      <span>{{ formatTime(comment.createdAt) }}</span>
                      <el-button text size="small" :icon="ChatLineRound">回复</el-button>
                      <el-button text size="small" :icon="CaretTop">{{ comment.likes || 0 }}</el-button>
                    </div>
                  </div>
                </div>
                <el-empty v-if="comments.length === 0" description="暂无评论" />
              </div>
            </div>
          </el-card>
        </el-col>

        <!-- 右侧边栏 -->
        <el-col :xs="24" :sm="24" :md="6">
          <!-- 相关文章 -->
          <el-card class="sidebar-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <el-icon><Reading /></el-icon>
                <span>相关文章</span>
              </div>
            </template>
            <div class="related-list">
              <div
                v-for="item in relatedArticles"
                :key="item.id"
                class="related-item"
                @click="goToDetail(item.id)"
              >
                <h4>{{ item.title }}</h4>
                <p>{{ formatTime(item.createdAt) }}</p>
              </div>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getArticleDetail, getRelatedArticles } from '@/api/article'
import type { Article } from '@/api/article'
import { User, Clock, View, Star, Share, ChatLineRound, CaretTop, Reading } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const submitting = ref(false)
const article = ref<Partial<Article>>({})
const relatedArticles = ref<Article[]>([])
const comments = ref<any[]>([])
const commentContent = ref('')
const isFavorited = ref(false)

const isLoggedIn = computed(() => userStore.isLoggedIn)

const fetchArticle = async () => {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('文章ID无效')
    router.push('/news')
    return
  }

  loading.value = true
  try {
    const data = await getArticleDetail(id)
    article.value = data
  } catch (error) {
    // 使用模拟数据
    article.value = {
      id,
      title: '这是文章详情页标题 - 展示完整的新闻内容',
      content: `
        <h2>文章导语</h2>
        <p>这是文章的导语部分，简要介绍文章的主要内容和背景信息。</p>

        <h2>第一部分：背景介绍</h2>
        <p>这里是文章的第一部分内容，详细介绍事件的背景和相关信息。文章内容应该条理清晰，层次分明，便于读者理解。</p>
        <p>每个段落都应该围绕一个中心思想展开，段落之间要有逻辑连接，保证文章的连贯性和可读性。</p>

        <h2>第二部分：详细分析</h2>
        <p>在这一部分，我们将深入分析事件的各个方面，包括原因、影响、趋势等。</p>
        <ul>
          <li>要点一：详细说明第一个要点</li>
          <li>要点二：详细说明第二个要点</li>
          <li>要点三：详细说明第三个要点</li>
        </ul>

        <h2>第三部分：总结展望</h2>
        <p>最后，我们对整个事件进行总结，并展望未来的发展趋势。</p>
        <p>通过以上分析，我们可以得出以下结论...</p>
      `,
      summary: '这是文章摘要，简要介绍文章的主要内容',
      cover: 'https://picsum.photos/800/400?random=' + id,
      categoryId: 1,
      categoryName: '新闻',
      authorId: 1,
      authorName: '编辑部',
      views: Math.floor(Math.random() * 10000),
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      tags: ['热点', '重要', '推荐']
    }
  } finally {
    loading.value = false
  }
}

const fetchRelatedArticles = async () => {
  const id = Number(route.params.id)
  try {
    const data = await getRelatedArticles(id, 5)
    relatedArticles.value = data
  } catch (error) {
    // 模拟数据
    relatedArticles.value = Array.from({ length: 5 }, (_, i) => ({
      id: id + i + 1,
      title: `相关文章标题 ${i + 1}`,
      content: '',
      summary: '',
      categoryId: 1,
      authorId: 1,
      views: 1000,
      status: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }))
  }
}

const fetchComments = () => {
  // 模拟评论数据
  comments.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    username: '用户' + (i + 1),
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${i}`,
    content: '这是一条评论内容，表达对文章的看法和观点。',
    likes: Math.floor(Math.random() * 100),
    createdAt: new Date(Date.now() - Math.random() * 86400000).toISOString()
  }))
}

const formatTime = (time: string) => {
  const date = new Date(time)
  return date.toLocaleString('zh-CN')
}

const handleFavorite = () => {
  if (!isLoggedIn.value) {
    ElMessage.warning('请先登录')
    router.push('/login')
    return
  }
  isFavorited.value = !isFavorited.value
  ElMessage.success(isFavorited.value ? '收藏成功' : '取消收藏')
}

const handleShare = () => {
  const url = window.location.href
  navigator.clipboard.writeText(url).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  })
}

const submitComment = async () => {
  if (!commentContent.value.trim()) {
    ElMessage.warning('请输入评论内容')
    return
  }

  submitting.value = true
  try {
    // 模拟提交评论
    await new Promise(resolve => setTimeout(resolve, 1000))

    comments.value.unshift({
      id: Date.now(),
      username: userStore.userInfo?.username || '当前用户',
      userAvatar: userStore.userInfo?.avatar || '',
      content: commentContent.value,
      likes: 0,
      createdAt: new Date().toISOString()
    })

    commentContent.value = ''
    ElMessage.success('评论发表成功')
  } catch (error) {
    ElMessage.error('评论发表失败')
  } finally {
    submitting.value = false
  }
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
  fetchArticle()
  fetchRelatedArticles()
  window.scrollTo(0, 0)
}

onMounted(() => {
  fetchArticle()
  fetchRelatedArticles()
  fetchComments()
})
</script>

<style scoped lang="css">
.article-detail {
  min-height: 60vh;
}

.article-content {
  padding: 20px;
}

.article-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eee;
}

.article-header h1 {
  font-size: 32px;
  color: #303133;
  margin: 0 0 20px;
  line-height: 1.4;
}

.article-meta {
  display: flex;
  gap: 20px;
  align-items: center;
  font-size: 14px;
  color: #909399;
  flex-wrap: wrap;
}

.article-meta span {
  display: flex;
  align-items: center;
  gap: 5px;
}

.article-cover {
  margin-bottom: 30px;
  text-align: center;
}

.article-cover img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
}

.article-summary {
  background: #f5f7fa;
  padding: 20px;
  border-left: 4px solid #409EFF;
  margin-bottom: 30px;
  border-radius: 4px;
}

.article-summary p {
  margin: 0;
  font-size: 16px;
  color: #606266;
  line-height: 1.8;
}

.article-body {
  font-size: 16px;
  line-height: 1.8;
  color: #303133;
  margin-bottom: 30px;
}

.article-body :deep(h2) {
  font-size: 24px;
  margin: 30px 0 15px;
  color: #303133;
}

.article-body :deep(p) {
  margin-bottom: 15px;
  text-indent: 2em;
}

.article-body :deep(ul),
.article-body :deep(ol) {
  margin: 15px 0;
  padding-left: 30px;
}

.article-body :deep(li) {
  margin-bottom: 8px;
}

.article-tags {
  margin-bottom: 20px;
  padding: 15px 0;
  border-top: 1px solid #eee;
}

.article-actions {
  display: flex;
  gap: 10px;
  padding: 20px 0;
  border-top: 1px solid #eee;
}

.comment-section {
  margin-top: 40px;
  padding-top: 30px;
  border-top: 2px solid #eee;
}

.comment-section h3 {
  font-size: 20px;
  margin-bottom: 20px;
}

.comment-form {
  margin-bottom: 30px;
}

.comment-form .el-button {
  margin-top: 10px;
}

.comment-login-tip {
  margin-bottom: 30px;
}

.comment-login-tip a {
  color: #409EFF;
  text-decoration: none;
}

.comment-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.comment-item {
  display: flex;
  gap: 15px;
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
}

.comment-content {
  flex: 1;
}

.comment-user {
  font-weight: bold;
  margin-bottom: 8px;
  color: #303133;
}

.comment-text {
  margin-bottom: 10px;
  line-height: 1.6;
  color: #606266;
}

.comment-meta {
  display: flex;
  gap: 15px;
  align-items: center;
  font-size: 13px;
  color: #909399;
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

.related-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.related-item {
  cursor: pointer;
  padding: 10px;
  border-radius: 4px;
  transition: background 0.3s;
}

.related-item:hover {
  background: #f5f7fa;
}

.related-item h4 {
  font-size: 14px;
  color: #303133;
  margin: 0 0 8px;
  line-height: 1.4;
}

.related-item p {
  font-size: 12px;
  color: #909399;
  margin: 0;
}

@media (max-width: 768px) {
  .article-header h1 {
    font-size: 24px;
  }

  .article-meta {
    gap: 10px;
  }

  .article-body {
    font-size: 15px;
  }

  .comment-item {
    flex-direction: column;
  }
}
</style>
