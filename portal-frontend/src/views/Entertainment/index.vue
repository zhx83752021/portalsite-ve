<template>
  <div class="ent-page">
    <div class="container">

      <!-- 页头 -->
      <header class="page-head">
        <div class="crumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <span>娱乐</span>
        </div>
        <div class="head-row">
          <h1 class="title">娱乐文化</h1>
          <p class="sub">影视、音乐、艺术、时尚——记录当代大众文化的流动与转向。</p>
        </div>
        <p class="sig">CULTURE · ARTS · LIFESTYLE</p>
      </header>

      <!-- 超大头条（杂志封面式） -->
      <section class="cover-hero" v-if="heroArticle">
        <HeroHeadline :article="heroArticle" layout="overlay" />
      </section>

      <!-- 双栏专题 -->
      <section class="dual-feature" v-if="featureList.length >= 2">
        <article v-for="a in featureList" :key="a.id" class="df-item" @click="goDetail(a.id)">
          <div class="df-media">
            <img v-if="a.cover" :src="a.cover" :alt="a.title" loading="lazy" decoding="async" @error="onErr" />
            <CategoryCover v-else slug="entertainment" :title="a.title" :width="800" :height="500" />
          </div>
          <div class="df-text">
            <span class="df-eyebrow">专题</span>
            <h3 class="df-title">{{ a.title }}</h3>
            <p class="df-summary">{{ a.summary }}</p>
            <span class="df-more">阅读 →</span>
          </div>
        </article>
      </section>

      <!-- 主内容区 -->
      <div class="layout">
        <main class="col-main">
          <SectionHeader title="文化观察" eyebrow="CULTURE" more="/news?cat=entertainment" />
          <el-empty v-if="!tilesList.length" description="暂无娱乐类内容" />
          <div class="tiles">
            <NewsListCard v-for="a in tilesList" :key="a.id" :article="a" variant="tile" />
          </div>
        </main>

        <aside class="col-side">
          <div class="panel">
            <SectionHeader title="热门话题" eyebrow="TRENDING" />
            <ol class="trend">
              <li v-for="(t, i) in trending" :key="t.topic" class="t-item">
                <span class="ti-rank" :class="{ top: i < 3 }">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <div class="ti-body">
                  <div class="ti-topic"># {{ t.topic }}</div>
                  <div class="ti-meta">{{ t.hot }} 热度</div>
                </div>
              </li>
            </ol>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getArticleList } from '@/api/article'
import type { Article } from '@/api/article'
import { resolveCategoryIdBySlug } from '@/utils/category'
import HeroHeadline from '@/components/ui/HeroHeadline.vue'
import NewsListCard from '@/components/ui/NewsListCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import CategoryCover from '@/components/ui/CategoryCover.vue'
import { buildCoverDataUrl } from '@/components/ui/category-cover'

const router = useRouter()
const articles = ref<Article[]>([])

const heroArticle = computed<Article | null>(() => articles.value[0] || null)
const featureList = computed(() => articles.value.slice(1, 3))
const tilesList = computed(() => articles.value.slice(3, 9))

const trending = ref([
  { topic: '春季档影视', hot: '8.2M' },
  { topic: '国风音乐', hot: '5.6M' },
  { topic: '独立电影', hot: '3.1M' },
  { topic: 'AI 与创作', hot: '2.8M' },
  { topic: '年轻艺术家', hot: '1.9M' },
  { topic: '地方戏曲复兴', hot: '1.5M' },
])

const fetchData = async () => {
  try {
    const categoryId = await resolveCategoryIdBySlug('entertainment')
    const res = await getArticleList({ page: 1, pageSize: 12, categoryId })
    articles.value = res.list || []
  } catch {
    articles.value = []
  }
}

const goDetail = (id: number) => router.push(`/news/${id}`)

const onErr = (e: Event) => {
  const img = e.target as HTMLImageElement
  img.src = buildCoverDataUrl('entertainment', img.alt)
}

onMounted(fetchData)
</script>

<style scoped>
.ent-page {
  padding-bottom: 80px;
  min-height: 60vh;
  background: #fff;
}

/* page head */
.page-head {
  padding: 32px 0 28px;
  margin-bottom: 40px;
  border-bottom: 1px solid var(--line);
}

.crumb {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--ink-400);
  letter-spacing: 0.08em;
  margin-bottom: 16px;
  display: flex;
  gap: 8px;
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

.head-row {
  display: flex;
  align-items: baseline;
  gap: 24px;
  flex-wrap: wrap;
}

.title {
  font-family: var(--font-display);
  font-size: var(--fs-display-2);
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0;
  letter-spacing: -0.015em;
  position: relative;
  padding-left: 16px;
}

.title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 8px;
  bottom: 8px;
  width: 4px;
  background: var(--brand-red);
}

.sub {
  font-size: var(--fs-list);
  color: var(--ink-600);
  margin: 0;
  line-height: 1.7;
}

.sig {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.24em;
  color: var(--brand-red);
  margin: 10px 0 0;
}

/* cover hero */
.cover-hero {
  margin-bottom: 48px;
}

/* dual feature */
.dual-feature {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  padding: 40px 0;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  margin-bottom: 48px;
}

@media (max-width: 840px) {
  .dual-feature {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.df-item {
  cursor: pointer;
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
}

.df-media {
  aspect-ratio: 4 / 5;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--mist-100);
}

.df-media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
  filter: grayscale(0.15);
}

.df-item:hover .df-media img {
  transform: scale(1.04);
  filter: grayscale(0);
}

.df-eyebrow {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.22em;
  color: var(--brand-red);
  display: inline-block;
  margin-bottom: 10px;
}

.df-title {
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0 0 12px;
  line-height: 1.25;
  letter-spacing: -0.01em;
  transition: color var(--dur-fast) var(--ease);
}

.df-item:hover .df-title {
  color: var(--brand-red);
}

.df-summary {
  font-family: var(--font-display);
  font-size: 16px;
  font-style: italic;
  color: var(--ink-600);
  line-height: 1.7;
  margin: 0 0 12px;
}

.df-more {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  letter-spacing: 0.12em;
  color: var(--brand-red);
}

/* layout */
.layout {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 48px;
}

@media (max-width: 960px) {
  .layout {
    grid-template-columns: 1fr;
  }
}

.col-main {
  min-width: 0;
}

.col-side {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 28px 24px;
}

@media (max-width: 560px) {
  .tiles {
    grid-template-columns: 1fr;
  }
}

/* trending */
.trend {
  list-style: none;
  margin: 0;
  padding: 0;
}

.t-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;
}

.t-item:last-child {
  border-bottom: none;
}

.ti-rank {
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: var(--fw-bold);
  color: var(--ink-300);
  line-height: 1;
  width: 36px;
}

.ti-rank.top {
  color: var(--brand-red);
}

.ti-body {
  flex: 1;
  min-width: 0;
}

.ti-topic {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
  margin-bottom: 4px;
}

.ti-meta {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
}
</style>
