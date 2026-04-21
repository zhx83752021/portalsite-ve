<template>
  <div class="detail-page" v-loading="loading">
    <div class="container">

      <div class="layout">
        <!-- ============ 左：正文 ============ -->
        <article class="col-main">

          <!-- 面包屑 -->
          <nav class="crumb">
            <router-link to="/">首页</router-link>
            <span class="sep">/</span>
            <router-link to="/news">新闻中心</router-link>
            <span v-if="article.categoryName" class="sep">/</span>
            <span v-if="article.categoryName" class="cur">{{ article.categoryName }}</span>
          </nav>

          <!-- 文章头 -->
          <header class="art-head">
            <div class="eyebrow">
              <MetaChip v-if="article.categoryName" :label="article.categoryName" variant="solid" tone="red" />
              <span class="time-line">
                <time>{{ fullTime(article.createdAt) }}</time>
                <span class="sep">·</span>
                <span>{{ formatNum(article.views) }} 阅读</span>
                <span class="sep">·</span>
                <span class="read-time">预计阅读 {{ readMinutes }} 分钟</span>
              </span>
            </div>
            <h1 class="title">{{ article.title }}</h1>
            <p class="lead" v-if="article.summary">{{ article.summary }}</p>
            <div class="byline">
              <div class="author">
                <div class="avatar">{{ (article.authorName || '编').charAt(0) }}</div>
                <div class="a-info">
                  <div class="a-name">{{ article.authorName || '编辑部' }}</div>
                  <div class="a-role">记者 · 综合报道</div>
                </div>
              </div>
              <div class="actions">
                <button class="act-btn" type="button" @click="handleFavorite">
                  <el-icon>
                    <Star />
                  </el-icon>
                  {{ isFavorited ? '已收藏' : '收藏' }}
                </button>
                <button class="act-btn" type="button" @click="handleShare">
                  <el-icon>
                    <Share />
                  </el-icon>
                  分享
                </button>
              </div>
            </div>
          </header>

          <!-- 封面 -->
          <figure class="art-cover" v-if="article.cover">
            <img :src="article.cover" :alt="article.title" loading="eager" decoding="async" fetchpriority="high" />
            <figcaption v-if="article.summary" class="caption">{{ article.summary }}</figcaption>
          </figure>
          <figure class="art-cover" v-else-if="article.id">
            <CategoryCover :slug="slug" :title="article.title" :width="1120" :height="630" :show-ruler="true" />
          </figure>

          <!-- 正文 -->
          <div class="art-body" ref="bodyRef" v-html="article.content"></div>

          <!-- 标签 -->
          <div class="art-tags" v-if="article.tags && article.tags.length">
            <span class="t-label">相关标签</span>
            <button v-for="t in article.tags" :key="t" type="button" class="tag">
              # {{ t }}
            </button>
          </div>

          <!-- 转载声明 -->
          <aside class="disclaimer">
            本文内容来自综合门户编辑部整理，转载请注明出处。
          </aside>

          <CommentBox v-if="article.id" :article-id="article.id" />
        </article>

        <!-- ============ 右：目录 + 相关 ============ -->
        <aside class="col-side">
          <div class="sticky">
            <div class="panel" v-if="toc.length">
              <div class="panel-head">
                <span class="eyebrow-chip">目录</span>
                <span class="num">{{ toc.length }}</span>
              </div>
              <ol class="toc">
                <li v-for="h in toc" :key="h.id" :class="['toc-li', `lv-${h.level}`, { active: activeHeading === h.id }]"
                  @click="scrollTo(h.id)">
                  <span class="toc-bar" aria-hidden="true"></span>
                  <span class="toc-text">{{ h.text }}</span>
                </li>
              </ol>
            </div>

            <div class="panel">
              <SectionHeader title="相关文章" eyebrow="RELATED" />
              <ol class="related">
                <li v-for="r in relatedArticles" :key="r.id" class="r-item" @click="goToDetail(r.id)">
                  <span class="r-num">{{ r.id }}</span>
                  <div class="r-main">
                    <div class="r-title">{{ r.title }}</div>
                    <div class="r-meta">{{ relativeTime(r.createdAt) }}</div>
                  </div>
                </li>
              </ol>
            </div>
          </div>
        </aside>
      </div>
    </div>

    <!-- 阅读进度条 -->
    <div class="read-progress" :style="{ width: readProgress + '%' }" aria-hidden="true"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { getArticleDetail, getRelatedArticles } from '@/api/article'
import type { Article } from '@/api/article'
import { Star, Share } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { relativeTime, formatNum, resolveSlug } from '@/utils/category'
import MetaChip from '@/components/ui/MetaChip.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import CategoryCover from '@/components/ui/CategoryCover.vue'
import CommentBox from '@/components/business/CommentBox.vue'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const loading = ref(false)
const article = ref<Partial<Article & { categorySlug?: string }>>({})
const relatedArticles = ref<Article[]>([])
const isFavorited = ref(false)

const bodyRef = ref<HTMLElement | null>(null)
const toc = ref<{ id: string; text: string; level: number }[]>([])
const activeHeading = ref<string>('')
const readProgress = ref(0)

const isLoggedIn = computed(() => userStore.isLoggedIn)
const slug = computed(() => resolveSlug(article.value))

const readMinutes = computed(() => {
  const text = (article.value.content || '').replace(/<[^>]*>/g, '')
  return Math.max(1, Math.round(text.length / 500))
})

const fullTime = (t?: string) => {
  if (!t) return ''
  const d = new Date(t)
  const pad = (n: number) => String(n).padStart(2, '0')
  const week = ['日', '一', '二', '三', '四', '五', '六']
  return `${d.getFullYear()}.${pad(d.getMonth() + 1)}.${pad(d.getDate())} ${pad(d.getHours())}:${pad(d.getMinutes())} · 周${week[d.getDay()]}`
}

const fetchArticle = async () => {
  const id = Number(route.params.id)
  if (!id) {
    ElMessage.error('文章 ID 无效')
    router.push('/news')
    return
  }
  loading.value = true
  try {
    article.value = await getArticleDetail(id)
  } catch {
    ElMessage.error('文章不存在或加载失败')
    article.value = {}
    router.push('/news')
  } finally {
    loading.value = false
    nextTick(() => {
      if (article.value?.content) buildToc()
    })
  }
}

const fetchRelated = async () => {
  const id = Number(route.params.id)
  try {
    relatedArticles.value = await getRelatedArticles(id, 6)
  } catch {
    relatedArticles.value = []
  }
}

const buildToc = () => {
  if (!bodyRef.value) return
  const hs = bodyRef.value.querySelectorAll('h2, h3')
  const list: { id: string; text: string; level: number }[] = []
  hs.forEach((el, idx) => {
    const h = el as HTMLElement
    if (!h.id) h.id = `h-auto-${idx}`
    list.push({ id: h.id, text: h.textContent || '', level: h.tagName === 'H2' ? 2 : 3 })
  })
  toc.value = list
}

const scrollTo = (id: string) => {
  const el = document.getElementById(id)
  if (el) {
    const y = el.getBoundingClientRect().top + window.scrollY - 140
    window.scrollTo({ top: y, behavior: 'smooth' })
  }
}

const onScroll = () => {
  const doc = document.documentElement
  const sh = doc.scrollHeight - doc.clientHeight
  readProgress.value = sh > 0 ? Math.min(100, Math.max(0, (window.scrollY / sh) * 100)) : 0

  if (!bodyRef.value || !toc.value.length) return
  const threshold = 180
  let cur = toc.value[0]?.id || ''
  for (const h of toc.value) {
    const el = document.getElementById(h.id)
    if (!el) continue
    if (el.getBoundingClientRect().top <= threshold) cur = h.id
  }
  activeHeading.value = cur
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
  navigator.clipboard.writeText(window.location.href).then(() => {
    ElMessage.success('链接已复制到剪贴板')
  })
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

watch(
  () => route.params.id,
  () => {
    window.scrollTo(0, 0)
    fetchArticle()
    fetchRelated()
  },
)

onMounted(() => {
  fetchArticle()
  fetchRelated()
  window.addEventListener('scroll', onScroll, { passive: true })
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll)
})
</script>

<style scoped>
.detail-page {
  min-height: 60vh;
  padding: 28px 0 80px;
  background: #fff;
  position: relative;
}

.read-progress {
  position: fixed;
  top: 0;
  left: 0;
  height: 3px;
  background: var(--brand-red);
  z-index: 2000;
  transition: width 80ms linear;
}

.layout {
  display: grid;
  grid-template-columns: minmax(0, 1fr) 280px;
  gap: 56px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

/* ============ 面包屑 ============ */
.crumb {
  display: flex;
  gap: 8px;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  letter-spacing: 0.06em;
  color: var(--ink-400);
  margin-bottom: 24px;
}

.crumb a {
  color: var(--ink-600);
  text-decoration: none;
}

.crumb a:hover {
  color: var(--brand-red);
}

.crumb .sep {
  color: var(--ink-300);
}

.crumb .cur {
  color: var(--ink-900);
}

/* ============ 文章头 ============ */
.art-head {
  max-width: 760px;
  margin: 0 0 32px;
  padding-bottom: 24px;
  border-bottom: 1px solid var(--line);
}

.eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 20px;
}

.time-line {
  font-family: var(--font-mono);
  font-size: 13px;
  color: var(--ink-400);
  display: inline-flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}

.time-line .sep {
  color: var(--ink-300);
}

.time-line .read-time {
  color: var(--brand-red);
}

.title {
  font-family: var(--font-display);
  font-size: var(--fs-display-1);
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0 0 20px;
  line-height: 1.15;
  letter-spacing: -0.02em;
}

@media (max-width: 960px) {
  .title {
    font-size: 32px;
  }
}

.lead {
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: var(--fw-regular);
  line-height: 1.7;
  color: var(--ink-700);
  margin: 0 0 24px;
  font-style: italic;
}

.byline {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  flex-wrap: wrap;
}

.author {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: var(--brand-navy);
  color: #fff;
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: var(--fw-bold);
  display: flex;
  align-items: center;
  justify-content: center;
}

.a-name {
  font-size: 14px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
}

.a-role {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
  letter-spacing: 0.08em;
}

.actions {
  display: flex;
  gap: 10px;
}

.act-btn {
  appearance: none;
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink-600);
  padding: 8px 14px;
  font-size: 13px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  transition:
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.act-btn:hover {
  color: var(--brand-red);
  border-color: var(--brand-red);
}

/* ============ 封面 ============ */
.art-cover {
  margin: 0 0 36px;
}

.art-cover img {
  width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  display: block;
}

.art-cover .caption {
  font-family: var(--font-body);
  font-size: 13px;
  color: var(--ink-400);
  margin-top: 10px;
  padding-left: 12px;
  border-left: 2px solid var(--brand-red);
  line-height: 1.6;
}

/* ============ 正文 ============ */
.art-body {
  max-width: 760px;
  font-family: var(--font-display);
  font-size: 18px;
  line-height: 1.85;
  color: var(--ink-700);
}

.art-body :deep(h2) {
  font-family: var(--font-display);
  font-size: 26px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 48px 0 16px;
  padding-left: 12px;
  border-left: 3px solid var(--brand-red);
  line-height: 1.3;
  scroll-margin-top: 140px;
}

.art-body :deep(h3) {
  font-family: var(--font-body);
  font-size: 20px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
  margin: 32px 0 12px;
  scroll-margin-top: 140px;
}

.art-body :deep(p) {
  margin-bottom: 20px;
  text-indent: 2em;
}

.art-body :deep(p:first-child)::first-letter {
  font-size: 3em;
  font-weight: var(--fw-bold);
  color: var(--brand-navy);
  float: left;
  line-height: 0.9;
  padding: 4px 8px 0 0;
}

.art-body :deep(blockquote) {
  margin: 24px 0;
  padding: 12px 20px 12px 24px;
  border-left: 3px solid var(--brand-gold);
  background: var(--mist-50);
  font-family: var(--font-display);
  font-style: italic;
  font-size: 17px;
  color: var(--ink-700);
  line-height: 1.7;
}

.art-body :deep(ul),
.art-body :deep(ol) {
  margin: 16px 0;
  padding-left: 28px;
}

.art-body :deep(li) {
  margin-bottom: 8px;
}

.art-body :deep(img) {
  width: 100%;
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-sm);
  margin: 24px 0;
}

/* ============ 标签 ============ */
.art-tags {
  max-width: 760px;
  margin: 48px 0 24px;
  padding-top: 24px;
  border-top: 1px solid var(--line);
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  align-items: center;
}

.t-label {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--ink-400);
  letter-spacing: 0.12em;
  margin-right: 8px;
}

.tag {
  appearance: none;
  background: var(--mist-100);
  border: 1px solid transparent;
  color: var(--ink-600);
  padding: 5px 12px;
  font-size: 13px;
  border-radius: var(--radius-xs);
  cursor: pointer;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease),
    border-color var(--dur-fast) var(--ease);
}

.tag:hover {
  background: #fff;
  color: var(--brand-red);
  border-color: var(--brand-red);
}

.disclaimer {
  max-width: 760px;
  font-size: 13px;
  color: var(--ink-400);
  padding: 16px 0;
  border-top: 1px dashed var(--line);
  border-bottom: 1px dashed var(--line);
  margin-bottom: 48px;
  font-style: italic;
}

/* ============ 评论 ============ */
.comments {
  max-width: 760px;
  margin-top: 24px;
}

.c-form {
  margin-bottom: 24px;
}

.c-form-foot {
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
}

.c-login {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: var(--mist-50);
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  margin-bottom: 24px;
  color: var(--ink-600);
  font-size: 14px;
}

.c-login-btn {
  color: #fff;
  background: var(--brand-navy);
  padding: 6px 16px;
  border-radius: var(--radius-xs);
  font-size: 13px;
  text-decoration: none;
}

.c-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.c-item {
  display: flex;
  gap: 14px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--line);
}

.c-item:last-child {
  border-bottom: none;
}

.c-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--mist-100);
  color: var(--ink-600);
  font-family: var(--font-display);
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.c-body {
  flex: 1;
}

.c-head {
  display: flex;
  gap: 10px;
  align-items: baseline;
  margin-bottom: 6px;
}

.c-name {
  font-size: 14px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
}

.c-time {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
}

.c-text {
  margin: 0 0 10px;
  line-height: 1.7;
  color: var(--ink-700);
  font-size: 14px;
}

.c-actions {
  display: flex;
  gap: 8px;
}

.c-btn {
  appearance: none;
  background: transparent;
  border: none;
  padding: 4px 8px;
  font-size: var(--fs-meta);
  color: var(--ink-400);
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border-radius: var(--radius-xs);
}

.c-btn:hover {
  color: var(--brand-red);
  background: var(--mist-100);
}

.c-empty {
  color: var(--ink-400);
  font-size: 14px;
  text-align: center;
  padding: 24px 0;
}

/* ============ 侧栏 ============ */
.col-side {
  min-width: 0;
}

.sticky {
  position: sticky;
  top: 180px;
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.panel-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 12px;
}

.eyebrow-chip {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-red);
  font-weight: var(--fw-medium);
}

.num {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--ink-400);
}

/* TOC */
.toc {
  list-style: none;
  margin: 0;
  padding: 0;
}

.toc-li {
  display: flex;
  gap: 10px;
  align-items: flex-start;
  padding: 8px 0;
  cursor: pointer;
  font-size: 13px;
  color: var(--ink-600);
  line-height: 1.5;
  transition: color var(--dur-fast) var(--ease);
}

.toc-li.lv-3 {
  padding-left: 16px;
  font-size: var(--fs-meta);
}

.toc-bar {
  width: 2px;
  background: var(--line);
  flex-shrink: 0;
  margin-top: 6px;
  height: 12px;
  transition: background var(--dur-fast) var(--ease);
}

.toc-li:hover {
  color: var(--ink-900);
}

.toc-li:hover .toc-bar {
  background: var(--ink-400);
}

.toc-li.active {
  color: var(--brand-red);
  font-weight: var(--fw-medium);
}

.toc-li.active .toc-bar {
  background: var(--brand-red);
}

.toc-text {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* related list */
.related {
  list-style: none;
  margin: 0;
  padding: 0;
}

.r-item {
  display: flex;
  gap: 10px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  align-items: flex-start;
}

.r-item:last-child {
  border-bottom: none;
}

.r-item:hover .r-title {
  color: var(--brand-red);
}

.r-num {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
  width: 32px;
  flex-shrink: 0;
}

.r-main {
  flex: 1;
  min-width: 0;
}

.r-title {
  font-size: 13px;
  color: var(--ink-900);
  line-height: 1.5;
  margin-bottom: 4px;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.r-meta {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
}
</style>
