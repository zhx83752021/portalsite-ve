<template>
  <div class="sports-page">

    <!-- 顶部红色横幅 -->
    <div class="banner">
      <div class="container banner-inner">
        <span class="live-dot"></span>
        <span class="banner-label">赛事中心</span>
        <span class="sep">·</span>
        <span class="date">{{ today }}</span>
      </div>
    </div>

    <div class="container">

      <!-- 页头 -->
      <header class="page-head">
        <div class="crumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <span>体育</span>
        </div>
        <h1 class="title">体育</h1>
        <p class="sub">追踪顶级赛事、呈现中国力量——以镜头与数据还原竞技之美。</p>
      </header>

      <!-- 今日赛程：红色计分板 -->
      <section class="scoreboard">
        <SectionHeader title="今日赛程" eyebrow="FIXTURES" />
        <div class="sb-grid">
          <article v-for="m in fixtures" :key="m.id" class="sb-card" :class="{ live: m.live }">
            <div class="sb-head">
              <span class="sb-league">{{ m.league }}</span>
              <span v-if="m.live" class="sb-live">LIVE</span>
              <span v-else class="sb-time">{{ m.time }}</span>
            </div>
            <div class="sb-row">
              <div class="team">{{ m.home }}</div>
              <div class="score">{{ m.live || m.final ? m.homeScore : '–' }}</div>
            </div>
            <div class="sb-row">
              <div class="team">{{ m.away }}</div>
              <div class="score">{{ m.live || m.final ? m.awayScore : '–' }}</div>
            </div>
            <div class="sb-foot">{{ m.venue }}</div>
          </article>
        </div>
      </section>

      <!-- Hero + 列表 -->
      <div class="layout">
        <main class="col-main">
          <section class="hero" v-if="heroArticle">
            <HeroHeadline :article="heroArticle" layout="overlay" />
          </section>

          <section class="grid-tiles">
            <SectionHeader title="热门报道" eyebrow="TOP STORIES" more="/news?cat=sports" />
            <div class="tiles">
              <NewsListCard v-for="a in tilesList" :key="a.id" :article="a" variant="tile" />
            </div>
          </section>

          <section class="list-section">
            <SectionHeader title="更多报道" eyebrow="MORE" />
            <div class="list">
              <NewsListCard v-for="a in rowList" :key="a.id" :article="a" variant="row" />
            </div>
          </section>
        </main>

        <aside class="col-side">
          <div class="panel">
            <SectionHeader title="积分榜" eyebrow="STANDINGS" />
            <table class="standings">
              <thead>
                <tr>
                  <th>#</th>
                  <th>球队</th>
                  <th>胜/负</th>
                  <th>胜率</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(s, i) in standings" :key="s.team">
                  <td :class="{ top: i < 3 }">{{ i + 1 }}</td>
                  <td class="nm">{{ s.team }}</td>
                  <td>{{ s.w }}-{{ s.l }}</td>
                  <td>{{ s.rate }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="panel-red">
            <div class="pr-label">SPOTLIGHT</div>
            <h3 class="pr-title">2026 大赛前瞻</h3>
            <p class="pr-desc">国家队集训进入关键阶段，十位记者带你读懂最新动态。</p>
            <router-link to="/news?cat=sports" class="pr-link">进入专题 →</router-link>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getArticleList } from '@/api/article'
import type { Article } from '@/api/article'
import { resolveCategoryIdBySlug } from '@/utils/category'
import HeroHeadline from '@/components/ui/HeroHeadline.vue'
import NewsListCard from '@/components/ui/NewsListCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const articles = ref<Article[]>([])

const heroArticle = computed<Article | null>(() => articles.value[0] || null)
const tilesList = computed(() => articles.value.slice(1, 5))
const rowList = computed(() => articles.value.slice(5, 12))

const today = new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit', weekday: 'long' })

const fixtures = ref([
  { id: 1, league: 'NBA', home: '湖人', away: '凯尔特人', homeScore: 102, awayScore: 108, final: true, live: false, time: '', venue: '洛杉矶 · 斯台普斯中心' },
  { id: 2, league: '中超', home: '北京国安', away: '上海海港', homeScore: 1, awayScore: 1, live: true, final: false, time: '', venue: '工人体育场' },
  { id: 3, league: '英超', home: '曼城', away: '阿森纳', homeScore: 0, awayScore: 0, live: false, final: false, time: '23:30', venue: '伊蒂哈德' },
  { id: 4, league: 'CBA', home: '辽宁', away: '浙江', homeScore: 0, awayScore: 0, live: false, final: false, time: '19:35', venue: '沈阳奥体' },
])

const standings = ref([
  { team: '辽宁本钢', w: 32, l: 10, rate: '.762' },
  { team: '浙江广厦', w: 30, l: 12, rate: '.714' },
  { team: '新疆伊力特', w: 28, l: 14, rate: '.667' },
  { team: '广东宏远', w: 27, l: 15, rate: '.643' },
  { team: '北京首钢', w: 25, l: 17, rate: '.595' },
  { team: '上海久事', w: 23, l: 19, rate: '.548' },
])

const fetchData = async () => {
  try {
    const categoryId = await resolveCategoryIdBySlug('sports')
    const res = await getArticleList({ page: 1, pageSize: 12, categoryId })
    articles.value = res.list || []
  } catch {
    articles.value = []
  }
}

onMounted(fetchData)
</script>

<style scoped>
.sports-page {
  padding-bottom: 64px;
  min-height: 60vh;
}

/* banner */
.banner {
  background: var(--brand-red);
  color: #fff;
  height: 44px;
  display: flex;
  align-items: center;
}

.banner-inner {
  display: flex;
  align-items: center;
  gap: 12px;
}

.live-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #fff;
  animation: pulse 1.4s ease-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.3; }
}

.banner-label {
  font-family: var(--font-display);
  font-size: 16px;
  font-weight: var(--fw-bold);
  letter-spacing: 0.08em;
}

.banner .sep {
  color: rgba(255, 255, 255, 0.5);
}

.banner .date {
  font-family: var(--font-mono);
  font-size: 13px;
  color: rgba(255, 255, 255, 0.88);
}

/* page head */
.page-head {
  padding: 32px 0 28px;
  margin-bottom: 32px;
  border-bottom: 1px solid var(--line);
}

.crumb {
  font-family: var(--font-mono);
  font-size: var(--fs-meta);
  color: var(--ink-400);
  letter-spacing: 0.08em;
  margin-bottom: 14px;
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

.title {
  font-family: var(--font-display);
  font-size: var(--fs-display-1);
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0 0 10px;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.sub {
  font-size: 15px;
  color: var(--ink-600);
  margin: 0;
  line-height: 1.7;
  max-width: 600px;
}

/* scoreboard */
.scoreboard {
  margin-bottom: 48px;
}

.sb-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

@media (max-width: 960px) {
  .sb-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 560px) {
  .sb-grid {
    grid-template-columns: 1fr;
  }
}

.sb-card {
  background: #fff;
  border: 1px solid var(--line);
  border-top: 3px solid var(--ink-900);
  border-radius: var(--radius-xs);
  padding: 14px 16px;
  transition: border-color var(--dur-fast) var(--ease);
}

.sb-card.live {
  border-top-color: var(--brand-red);
}

.sb-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.12em;
  color: var(--ink-400);
  margin-bottom: 12px;
}

.sb-league {
  color: var(--ink-900);
  font-weight: var(--fw-medium);
}

.sb-live {
  color: var(--brand-red);
  font-weight: var(--fw-bold);
}

.sb-time {
  color: var(--ink-600);
}

.sb-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.team {
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
}

.score {
  font-family: var(--font-mono);
  font-size: 22px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
}

.sb-card.live .score {
  color: var(--brand-red);
}

.sb-foot {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  color: var(--ink-400);
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--line);
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
  display: flex;
  flex-direction: column;
  gap: 56px;
}

.col-side {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.tiles {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
}

@media (max-width: 560px) {
  .tiles {
    grid-template-columns: 1fr;
  }
}

.list {
  display: flex;
  flex-direction: column;
}

/* standings */
.standings {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.standings th {
  text-align: left;
  padding: 8px 4px;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.12em;
  color: var(--ink-400);
  border-bottom: 2px solid var(--ink-900);
  font-weight: var(--fw-medium);
}

.standings td {
  padding: 10px 4px;
  border-bottom: 1px solid var(--line);
  color: var(--ink-700);
  font-family: var(--font-mono);
}

.standings td.nm {
  font-family: var(--font-body);
  color: var(--ink-900);
  font-weight: var(--fw-medium);
}

.standings td.top {
  color: var(--brand-red);
  font-weight: var(--fw-bold);
}

/* red panel */
.panel-red {
  background: var(--brand-red);
  color: #fff;
  padding: 28px;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.panel-red::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: #fff;
}

.pr-label {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.22em;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.pr-title {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  margin: 0 0 12px;
}

.pr-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.88);
  line-height: 1.7;
  margin: 0 0 18px;
}

.pr-link {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid #fff;
  color: #fff;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.pr-link:hover {
  background: #fff;
  color: var(--brand-red);
}
</style>
