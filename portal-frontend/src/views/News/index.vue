<template>
  <div class="news-page">
    <div class="container">

      <!-- 页头 -->
      <header class="page-head">
        <div class="crumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <span>新闻中心</span>
        </div>
        <h1 class="page-headline">新闻中心</h1>
        <p class="page-sub">聚合时政、社会、国际、军事等多领域权威资讯。</p>
      </header>

      <!-- 分类 Tab 条 -->
      <div class="tabs-bar">
        <UnderlineTabs v-model="activeCategory" :tabs="categoryTabs" />
        <div class="search-inline">
          <el-input v-model="searchKeyword" placeholder="搜索新闻……" :prefix-icon="Search" clearable
            @keyup.enter="handleSearch" size="default" style="width: 260px" />
        </div>
      </div>

      <!-- 主布局 -->
      <div class="layout">
        <!-- 左：文章列表 -->
        <main class="col-main">
          <el-empty v-if="!loading && !articles.length" description="暂无匹配的文章" />

          <div v-else class="article-list">
            <NewsListCard v-for="(a, i) in articles" :key="a.id" :article="a" variant="row" :top-rank="i + 1" />
          </div>

          <div class="pagination" v-if="total > pageSize">
            <el-pagination v-model:current-page="currentPage" v-model:page-size="pageSize" :page-sizes="[10, 20, 40]"
              :total="total" :pager-count="7" layout="prev, pager, next, sizes, jumper" @size-change="handleSizeChange"
              @current-change="handlePageChange" />
          </div>
        </main>

        <!-- 右：侧栏 -->
        <aside class="col-side">
          <div class="panel">
            <SectionHeader title="热门文章" eyebrow="HOT" />
            <ol class="rank-list">
              <li v-for="(a, i) in hotArticles" :key="a.id" class="rank-item" @click="goToDetail(a.id)">
                <span class="rn" :class="{ top: i < 3 }">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <div class="r-body">
                  <div class="r-title">{{ a.title }}</div>
                  <div class="r-meta">
                    <span>{{ formatNum(a.views) }} 阅读</span>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <div class="panel">
            <SectionHeader title="标签" eyebrow="TAGS" />
            <div class="tag-cloud">
              <button v-for="t in tags" :key="t" type="button" class="tag" @click="searchByTag(t)">
                # {{ t }}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getArticleList, getHotArticles } from '@/api/article'
import { getCategoryList } from '@/api/category'
import type { Article } from '@/api/article'
import type { Category } from '@/api/category'
import { Search } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { formatNum } from '@/utils/category'
import NewsListCard from '@/components/ui/NewsListCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import UnderlineTabs from '@/components/ui/UnderlineTabs.vue'
import type { TabItem } from '@/components/ui/UnderlineTabs.vue'

const router = useRouter()
const route = useRoute()

const articles = ref<Article[]>([])
const hotArticles = ref<Article[]>([])
const categories = ref<Category[]>([])
const tags = ref<string[]>(['两会', '央行政策', '新能源', 'AI', '奥运', '芯片', '地缘政治', '改革开放'])

const activeCategory = ref<string | number>(0)
const searchKeyword = ref('')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const loading = ref(false)
const NEWS_CENTER_SLUGS = new Set(['politics', 'society', 'international', 'military'])

const categoryTabs = computed<TabItem[]>(() => [
  { label: '全部', value: 0 },
  ...categories.value
    .filter(c => NEWS_CENTER_SLUGS.has(c.slug))
    .map(c => ({ label: c.name, value: c.id })),
])

const selectedCategoryId = computed(() => {
  const v = activeCategory.value
  return typeof v === 'number' && v > 0 ? v : undefined
})

const fetchCategories = async () => {
  try {
    categories.value = await getCategoryList()
  } catch {
    categories.value = []
    ElMessage.error('分类加载失败，请稍后重试')
  }
}

const fetchArticles = async () => {
  loading.value = true
  try {
    const res = await getArticleList({
      page: currentPage.value,
      pageSize: pageSize.value,
      categoryId: selectedCategoryId.value,
      keyword: searchKeyword.value || undefined,
    })
    articles.value = res.list
    total.value = res.total
  } catch {
    articles.value = []
    total.value = 0
  } finally {
    loading.value = false
  }
}

const fetchHot = async () => {
  try {
    hotArticles.value = await getHotArticles(10)
  } catch {
    hotArticles.value = []
  }
}

watch([activeCategory, searchKeyword], () => {
  currentPage.value = 1
})

watch(activeCategory, () => fetchArticles())

const handleSearch = () => {
  currentPage.value = 1
  fetchArticles()
}

const searchByTag = (t: string) => {
  searchKeyword.value = t
  handleSearch()
}

const goToDetail = (id: number) => router.push(`/news/${id}`)

const handleSizeChange = (v: number) => {
  pageSize.value = v
  fetchArticles()
}

const handlePageChange = (v: number) => {
  currentPage.value = v
  fetchArticles()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

onMounted(async () => {
  if (route.query.keyword) searchKeyword.value = String(route.query.keyword)
  await fetchCategories()
  if (route.query.cat) {
    const slug = String(route.query.cat)
    const c = categories.value.find(c => c.slug === slug && NEWS_CENTER_SLUGS.has(c.slug))
    if (c) activeCategory.value = c.id
  }
  fetchArticles()
  fetchHot()
})

watch(
  () => route.query,
  q => {
    if (q.keyword !== undefined) {
      searchKeyword.value = String(q.keyword || '')
      handleSearch()
    }
  },
)
</script>

<style scoped>
.news-page {
  min-height: 60vh;
  padding-bottom: 64px;
}

/* ============ page head ============ */
.page-head {
  padding: 32px 0 24px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 28px;
}

.crumb {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--ink-400);
  letter-spacing: 0.08em;
  margin-bottom: 14px;
  display: flex;
  gap: 8px;
  align-items: center;
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

.page-headline {
  font-family: var(--font-display);
  font-size: var(--fs-display-2);
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0 0 10px;
  line-height: 1.15;
  letter-spacing: -0.015em;
}

.page-sub {
  font-size: 15px;
  color: var(--ink-600);
  margin: 0;
  line-height: 1.7;
}

/* ============ tabs bar ============ */
.tabs-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-bottom: 28px;
}

.search-inline {
  flex-shrink: 0;
}

@media (max-width: 960px) {
  .tabs-bar {
    flex-direction: column;
    align-items: stretch;
  }
  .search-inline {
    width: 100%;
  }
  .search-inline .el-input {
    width: 100% !important;
  }
}

/* ============ layout ============ */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 48px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.col-side {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* ============ pagination ============ */
.pagination {
  margin-top: 32px;
  display: flex;
  justify-content: center;
}

/* ============ rank list ============ */
.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
}

.rank-item {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  align-items: flex-start;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-item:hover .r-title {
  color: var(--brand-red);
}

.rn {
  font-family: var(--font-mono);
  font-size: 18px;
  font-weight: var(--fw-bold);
  color: var(--ink-300);
  line-height: 1;
  width: 28px;
}

.rn.top {
  color: var(--brand-red);
}

.r-body {
  flex: 1;
  min-width: 0;
}

.r-title {
  font-size: 14px;
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

/* ============ tags ============ */
.tag-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.tag {
  appearance: none;
  background: var(--mist-100);
  border: 1px solid transparent;
  color: var(--ink-600);
  padding: 6px 12px;
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
</style>
