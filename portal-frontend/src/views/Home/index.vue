<template>
  <div class="home-page">
    <div class="container">

      <!-- ============ 1. 头条 · 滚动资讯 ============ -->
      <section class="breaking" v-if="breakingNews.length">
        <span class="breaking-label">
          <span class="live-dot"></span>
          实时
        </span>
        <div class="ticker" @mouseenter="pauseTicker = true" @mouseleave="pauseTicker = false">
          <div class="ticker-track" :class="{ paused: pauseTicker }">
            <router-link v-for="item in breakingNews.concat(breakingNews)" :key="`${item.id}-${Math.random()}`"
              :to="`/news/${item.id}`" class="ticker-item">
              <span class="ticker-time">{{ shortTime(item.createdAt) }}</span>
              <span class="ticker-title">{{ item.title }}</span>
            </router-link>
          </div>
        </div>
      </section>

      <!-- ============ 2. Hero 焦点头条 ============ -->
      <section class="hero-section" v-if="heroArticle">
        <HeroHeadline :article="heroArticle" layout="split" />
      </section>

      <!-- ============ 3. 要闻二三 ============ -->
      <section class="sub-hero" v-if="subHeroes.length">
        <NewsListCard v-for="a in subHeroes" :key="a.id" :article="a" variant="tile" />
      </section>

      <!-- ============ 4. 主内容 + 侧栏 ============ -->
      <section class="main-grid">
        <!-- 左：今日要闻列表 -->
        <div class="col-main">
          <SectionHeader title="今日要闻" eyebrow="TODAY" :count="hotNews.length" more="/news" />
          <div class="news-list">
            <NewsListCard v-for="a in hotNews" :key="a.id" :article="a" variant="row" />
          </div>
        </div>

        <!-- 右：侧栏 -->
        <aside class="col-side">
          <!-- 推荐 TopN -->
          <div class="panel">
            <SectionHeader title="推荐阅读" eyebrow="MOST READ" />
            <ol class="rank-list">
              <li v-for="(a, i) in recommendNews.slice(0, 8)" :key="a.id" class="rank-item"
                @click="$router.push(`/news/${a.id}`)">
                <span class="rank-num" :class="{ top: i < 3 }">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <div class="rank-body">
                  <div class="rank-title">{{ a.title }}</div>
                  <div class="rank-meta">
                    <span class="cat">{{ a.categoryName }}</span>
                    <span class="sep">·</span>
                    <span>{{ formatNum(a.views) }} 阅读</span>
                  </div>
                </div>
              </li>
            </ol>
          </div>

          <!-- 专题卡 -->
          <div class="panel panel-feature">
            <div class="feature-label">SPECIAL REPORT</div>
            <h3 class="feature-title">2026 中国高质量发展观察</h3>
            <p class="feature-desc">十组深度报道，解码中国经济从规模增长转向创新驱动的关键路径。</p>
            <router-link to="/news?cat=politics" class="feature-link">
              查看专题 <span aria-hidden="true">→</span>
            </router-link>
          </div>
        </aside>
      </section>

      <!-- ============ 5. 频道矩阵 ============ -->
      <section class="channels-section">
        <SectionHeader title="频道" eyebrow="CHANNELS" />
        <div class="channels-grid">
          <router-link v-for="ch in channels" :key="ch.slug" :to="ch.path" class="ch-card"
            :style="{ '--ch-from': ch.from, '--ch-to': ch.to }">
            <div class="ch-media">
              <CategoryCover :slug="ch.slug" :width="480" :height="300" :show-ruler="true" />
            </div>
            <div class="ch-body">
              <h3 class="ch-name">{{ ch.name }}</h3>
              <p class="ch-desc">{{ ch.desc }}</p>
              <span class="ch-enter">进入 <span aria-hidden="true">→</span></span>
            </div>
          </router-link>
        </div>
      </section>

      <!-- ============ 6. 分栏：财经 / 体育 / 科技 ============ -->
      <section class="cross-section">
        <div class="cross-col">
          <SectionHeader title="财经" eyebrow="FINANCE" more="/finance" />
          <div class="cross-list">
            <NewsListCard v-for="a in financePreview" :key="a.id" :article="a" variant="line" />
          </div>
        </div>
        <div class="cross-col">
          <SectionHeader title="体育" eyebrow="SPORTS" more="/sports" />
          <div class="cross-list">
            <NewsListCard v-for="a in sportsPreview" :key="a.id" :article="a" variant="line" />
          </div>
        </div>
        <div class="cross-col">
          <SectionHeader title="科技" eyebrow="TECHNOLOGY" more="/tech" />
          <div class="cross-list">
            <NewsListCard v-for="a in techPreview" :key="a.id" :article="a" variant="line" />
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getHotArticles, getRecommendArticles, getArticleList } from '@/api/article'
import type { Article } from '@/api/article'
import { formatNum, resolveCategoryIdBySlug } from '@/utils/category'
import HeroHeadline from '@/components/ui/HeroHeadline.vue'
import NewsListCard from '@/components/ui/NewsListCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'
import CategoryCover from '@/components/ui/CategoryCover.vue'

const pauseTicker = ref(false)

const allHot = ref<Article[]>([])
const recommendNews = ref<Article[]>([])
const channelNews = ref<Record<string, Article[]>>({})

const heroArticle = computed<Article | null>(() => allHot.value[0] || null)
const subHeroes = computed(() => allHot.value.slice(1, 4))
const hotNews = computed(() => allHot.value.slice(4, 12))
const breakingNews = computed(() => allHot.value.slice(0, 8))

const financePreview = computed(() => (channelNews.value.finance || []).slice(0, 5))
const sportsPreview = computed(() => (channelNews.value.sports || []).slice(0, 5))
const techPreview = computed(() => (channelNews.value.tech || []).slice(0, 5))

const channels = [
  { slug: 'politics', name: '时政', desc: '政策脉络与高层动态', path: '/news?cat=politics', from: '#0A2540', to: '#061A33' },
  { slug: 'finance', name: '财经', desc: '市场行情与宏观经济', path: '/finance', from: '#0A2540', to: '#C9A961' },
  { slug: 'international', name: '国际', desc: '全球事件与中外关系', path: '/news?cat=international', from: '#0A2540', to: '#0E4C6E' },
  { slug: 'tech', name: '科技', desc: '前沿创新与产业观察', path: '/tech', from: '#0A2540', to: '#0E7490' },
  { slug: 'sports', name: '体育', desc: '顶级赛事与中国力量', path: '/sports', from: '#0A2540', to: '#C0392B' },
  { slug: 'entertainment', name: '娱乐', desc: '文化、艺术与大众视野', path: '/entertainment', from: '#C0392B', to: '#C9A961' },
]

const shortTime = (t: string) => {
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return ''
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const fetchData = async () => {
  try {
    const [hot, rec] = await Promise.all([
      getHotArticles(16).catch(() => []),
      getRecommendArticles(10).catch(() => []),
    ])
    allHot.value = hot || []
    recommendNews.value = rec || []

    const [finId, spoId, tecId] = await Promise.all([
      resolveCategoryIdBySlug('finance'),
      resolveCategoryIdBySlug('sports'),
      resolveCategoryIdBySlug('tech'),
    ])
    const [fin, spo, tec] = await Promise.all([
      getArticleList({ page: 1, pageSize: 6, categoryId: finId }).catch(() => null),
      getArticleList({ page: 1, pageSize: 6, categoryId: spoId }).catch(() => null),
      getArticleList({ page: 1, pageSize: 6, categoryId: tecId }).catch(() => null),
    ])
    channelNews.value = {
      finance: fin?.list || [],
      sports: spo?.list || [],
      tech: tec?.list || [],
    }
  } catch (err) {
    console.error(err)
    allHot.value = []
    recommendNews.value = []
    channelNews.value = { finance: [], sports: [], tech: [] }
  }
}

onMounted(fetchData)
</script>

<style scoped>
.home-page {
  padding-bottom: 64px;
}

/* ============ 1. Breaking ticker ============ */
.breaking {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 10px 16px;
  background: #fff;
  border: 1px solid var(--line);
  border-left: 3px solid var(--brand-red);
  margin: 20px 0 28px;
  overflow: hidden;
  border-radius: var(--radius-xs);
}

.breaking-label {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  font-weight: var(--fw-bold);
  letter-spacing: 0.16em;
  color: var(--brand-red);
  flex-shrink: 0;
  text-transform: uppercase;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--brand-red);
  animation: pulse 1.4s ease-out infinite;
}

@keyframes pulse {
  0%,
  100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(1.25); }
}

.ticker {
  flex: 1;
  overflow: hidden;
  position: relative;
  mask-image: linear-gradient(to right, transparent, #000 40px, #000 calc(100% - 40px), transparent);
}

.ticker-track {
  display: flex;
  gap: 40px;
  animation: marquee 50s linear infinite;
  white-space: nowrap;
  width: fit-content;
}

.ticker-track.paused {
  animation-play-state: paused;
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

.ticker-item {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  color: var(--ink-700);
  text-decoration: none;
  font-size: 14px;
  transition: color var(--dur-fast) var(--ease);
}

.ticker-item:hover {
  color: var(--brand-red);
}

.ticker-time {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--ink-400);
}

.ticker-title {
  font-weight: var(--fw-medium);
}

/* ============ 2. Hero ============ */
.hero-section {
  padding: 12px 0 40px;
  border-bottom: 1px solid var(--line);
}

/* ============ 3. Sub hero tiles ============ */
.sub-hero {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;
  padding: 36px 0 48px;
  border-bottom: 1px solid var(--line);
}

@media (max-width: 960px) {
  .sub-hero {
    grid-template-columns: 1fr;
    gap: 20px;
  }
}

/* ============ 4. Main + side ============ */
.main-grid {
  display: grid;
  grid-template-columns: minmax(0, 2fr) minmax(0, 1fr);
  gap: 48px;
  padding: 48px 0;
  border-bottom: 1px solid var(--line);
}

@media (max-width: 960px) {
  .main-grid {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.col-side {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

/* rank list */
.rank-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
}

.rank-item {
  display: flex;
  gap: 14px;
  padding: 14px 0;
  border-bottom: 1px solid var(--line);
  cursor: pointer;
  align-items: flex-start;
}

.rank-item:last-child {
  border-bottom: none;
}

.rank-item:hover .rank-title {
  color: var(--brand-red);
}

.rank-num {
  font-family: var(--font-mono);
  font-size: 20px;
  font-weight: var(--fw-bold);
  color: var(--ink-300);
  line-height: 1;
  width: 32px;
  flex-shrink: 0;
}

.rank-num.top {
  color: var(--brand-red);
}

.rank-body {
  flex: 1;
  min-width: 0;
}

.rank-title {
  font-size: 14px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
  line-height: 1.5;
  margin-bottom: 6px;
  transition: color var(--dur-fast) var(--ease);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.rank-meta {
  display: flex;
  gap: 6px;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
}

.rank-meta .cat {
  color: var(--brand-navy);
}

.rank-meta .sep {
  color: var(--ink-300);
}

/* feature panel */
.panel-feature {
  background: var(--brand-navy);
  color: #fff;
  padding: 28px;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.panel-feature::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: var(--brand-gold);
}

.feature-label {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  color: var(--brand-gold);
  margin-bottom: 12px;
}

.feature-title {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.3;
}

.feature-desc {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0 0 20px;
}

.feature-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border: 1px solid var(--brand-gold);
  color: var(--brand-gold);
  text-decoration: none;
  font-size: 13px;
  letter-spacing: 0.08em;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.feature-link:hover {
  background: var(--brand-gold);
  color: var(--brand-navy);
}

/* ============ 5. Channels ============ */
.channels-section {
  padding: 48px 0;
  border-bottom: 1px solid var(--line);
}

.channels-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

@media (max-width: 960px) {
  .channels-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .channels-grid {
    grid-template-columns: 1fr;
  }
}

.ch-card {
  position: relative;
  background: #fff;
  border: 1px solid var(--line);
  border-radius: var(--radius-md);
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  transition:
    border-color var(--dur-base) var(--ease),
    transform var(--dur-base) var(--ease),
    box-shadow var(--dur-base) var(--ease);
  display: flex;
  flex-direction: column;
}

.ch-card:hover {
  border-color: var(--brand-navy);
  transform: translateY(-3px);
  box-shadow: var(--shadow-lift);
}

.ch-media {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}

.ch-body {
  padding: 20px 24px;
}

.ch-name {
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0 0 6px;
  letter-spacing: 0.04em;
}

.ch-desc {
  font-size: 13px;
  color: var(--ink-600);
  line-height: 1.6;
  margin: 0 0 12px;
}

.ch-enter {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--brand-red);
  letter-spacing: 0.12em;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-transform: uppercase;
  transition: gap var(--dur-base) var(--ease);
}

.ch-card:hover .ch-enter {
  gap: 8px;
}

/* ============ 6. Cross sections ============ */
.cross-section {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 36px;
  padding: 48px 0;
}

@media (max-width: 960px) {
  .cross-section {
    grid-template-columns: 1fr;
    gap: 32px;
  }
}

.cross-list {
  display: flex;
  flex-direction: column;
}
</style>
