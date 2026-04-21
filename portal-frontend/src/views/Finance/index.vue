<template>
  <div class="finance-page">
    <p class="demo-market-note">以下为演示行情，非实时数据</p>
    <IndexTicker :items="marketData" />

    <div class="container">

      <!-- 页头 -->
      <header class="page-head">
        <div class="crumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <span>财经</span>
        </div>
        <div class="head-row">
          <h1 class="title">财经</h1>
          <p class="sub">宏观、市场、金融、产业——以数据驱动的财经报道。</p>
        </div>
      </header>

      <!-- 三大板块：头条 · 宏观 · 公司 -->
      <div class="layout">
        <main class="col-main">
          <!-- 财经头条 -->
          <section class="fin-hero" v-if="heroArticle">
            <HeroHeadline :article="heroArticle" layout="split" />
          </section>

          <!-- 今日要闻 -->
          <section class="fin-list">
            <SectionHeader title="今日财经" eyebrow="TODAY" more="/news?cat=finance" />
            <div class="list">
              <NewsListCard v-for="a in financeList" :key="a.id" :article="a" variant="row" />
            </div>
          </section>

          <!-- 数据板块：涨跌榜 -->
          <section class="tables">
            <SectionHeader title="板块表现" eyebrow="SECTORS" />
            <div class="tbl-grid">
              <div class="tbl">
                <div class="tbl-head"><span>涨幅榜</span><span class="up">TOP 5</span></div>
                <ol class="tbl-body">
                  <li v-for="(r, i) in topGainers" :key="r.code">
                    <span class="rk">{{ (i + 1).toString().padStart(2, '0') }}</span>
                    <span class="nm">{{ r.name }}</span>
                    <span class="vl">{{ r.price }}</span>
                    <span class="chg up">+{{ r.chg.toFixed(2) }}%</span>
                  </li>
                </ol>
              </div>
              <div class="tbl">
                <div class="tbl-head"><span>跌幅榜</span><span class="down">TOP 5</span></div>
                <ol class="tbl-body">
                  <li v-for="(r, i) in topLosers" :key="r.code">
                    <span class="rk">{{ (i + 1).toString().padStart(2, '0') }}</span>
                    <span class="nm">{{ r.name }}</span>
                    <span class="vl">{{ r.price }}</span>
                    <span class="chg down">{{ r.chg.toFixed(2) }}%</span>
                  </li>
                </ol>
              </div>
            </div>
          </section>
        </main>

        <!-- 侧栏 -->
        <aside class="col-side">
          <!-- 金色专题卡 -->
          <div class="panel-gold">
            <div class="pg-label">SPECIAL</div>
            <h3 class="pg-title">2026 资本市场关键词</h3>
            <p class="pg-desc">覆盖货币政策、产业转型、人民币国际化等六大主题的深度解读。</p>
            <router-link to="/news?cat=finance" class="pg-link">阅读专题 →</router-link>
          </div>

          <div class="panel">
            <SectionHeader title="热门推荐" eyebrow="MOST READ" />
            <ol class="rank-list">
              <li v-for="(a, i) in hotArticles" :key="a.id" class="rank-item" @click="goToDetail(a.id)">
                <span class="rn" :class="{ top: i < 3 }">{{ (i + 1).toString().padStart(2, '0') }}</span>
                <div class="r-body">
                  <div class="r-title">{{ a.title }}</div>
                  <div class="r-meta">{{ formatNum(a.views) }} 阅读</div>
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
import { getArticleList, getHotArticles } from '@/api/article'
import type { Article } from '@/api/article'
import { formatNum, resolveCategoryIdBySlug } from '@/utils/category'
import IndexTicker from '@/components/ui/IndexTicker.vue'
import HeroHeadline from '@/components/ui/HeroHeadline.vue'
import NewsListCard from '@/components/ui/NewsListCard.vue'
import SectionHeader from '@/components/ui/SectionHeader.vue'

const router = useRouter()

const articles = ref<Article[]>([])
const hotArticles = ref<Article[]>([])

const heroArticle = computed<Article | null>(() => articles.value[0] || null)
const financeList = computed(() => articles.value.slice(1, 9))

const marketData = ref([
  { code: '000001.SH', name: '上证指数', value: 3213.54, chg: 0.52 },
  { code: '399001.SZ', name: '深证成指', value: 10542.11, chg: -0.13 },
  { code: '399006.SZ', name: '创业板', value: 2018.36, chg: 0.85 },
  { code: 'HSI', name: '恒生指数', value: 18654.22, chg: 1.42 },
  { code: 'IXIC', name: '纳斯达克', value: 16427.18, chg: -0.28 },
  { code: 'DJI', name: '道琼斯', value: 38954.62, chg: 0.15 },
  { code: 'USDCNY', name: '美元兑人民币', value: 7.19, chg: -0.08 },
  { code: 'XAU', name: '现货黄金', value: 2042.55, chg: 0.31 },
])

const topGainers = ref([
  { code: '600519', name: '贵州茅台', price: '1723.50', chg: 3.42 },
  { code: '300750', name: '宁德时代', price: '212.80', chg: 2.95 },
  { code: '000858', name: '五粮液', price: '158.20', chg: 2.18 },
  { code: '600036', name: '招商银行', price: '33.75', chg: 1.92 },
  { code: '601318', name: '中国平安', price: '45.32', chg: 1.65 },
])

const topLosers = ref([
  { code: '000001', name: '平安银行', price: '10.52', chg: -2.88 },
  { code: '600900', name: '长江电力', price: '23.84', chg: -2.11 },
  { code: '600050', name: '中国联通', price: '5.23', chg: -1.76 },
  { code: '600887', name: '伊利股份', price: '27.45', chg: -1.52 },
  { code: '601857', name: '中国石油', price: '8.92', chg: -1.21 },
])

const fetchData = async () => {
  try {
    const categoryId = await resolveCategoryIdBySlug('finance')
    const [list, hot] = await Promise.all([
      getArticleList({ page: 1, pageSize: 10, categoryId }),
      getHotArticles(8),
    ])
    articles.value = list.list || []
    hotArticles.value = hot || []
  } catch {
    articles.value = []
    hotArticles.value = []
  }
}

const goToDetail = (id: number) => router.push(`/news/${id}`)

onMounted(fetchData)
</script>

<style scoped>
.demo-market-note {
  margin: 0;
  padding: 6px 16px;
  font-size: var(--fs-micro);
  color: var(--ink-600);
  background: var(--mist-100);
  text-align: center;
}

.finance-page {
  padding-bottom: 64px;
  min-height: 60vh;
}

/* page head */
.page-head {
  padding: 32px 0 28px;
  border-bottom: 1px solid var(--line);
  margin-bottom: 32px;
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
  background: var(--brand-gold);
}

.sub {
  font-size: var(--fs-list);
  color: var(--ink-600);
  margin: 0;
  line-height: 1.7;
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
  gap: 48px;
}

.col-side {
  display: flex;
  flex-direction: column;
  gap: 28px;
}

.fin-hero {
  padding-bottom: 16px;
}

.list {
  display: flex;
  flex-direction: column;
}

/* ============ 数据板块 ============ */
.tbl-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

@media (max-width: 640px) {
  .tbl-grid {
    grid-template-columns: 1fr;
  }
}

.tbl {
  border: 1px solid var(--line);
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: #fff;
}

.tbl-head {
  display: flex;
  justify-content: space-between;
  padding: 12px 16px;
  background: var(--mist-100);
  font-family: var(--font-display);
  font-size: 15px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
}

.tbl-head .up {
  color: #dc2626;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.12em;
}

.tbl-head .down {
  color: #16a34a;
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.12em;
}

.tbl-body {
  list-style: none;
  margin: 0;
  padding: 0;
}

.tbl-body li {
  display: grid;
  grid-template-columns: 32px 1fr auto 80px;
  gap: 12px;
  padding: 10px 16px;
  border-bottom: 1px solid var(--line);
  font-size: 13px;
  align-items: center;
}

.tbl-body li:last-child {
  border-bottom: none;
}

.tbl-body .rk {
  font-family: var(--font-mono);
  color: var(--ink-400);
}

.tbl-body .nm {
  color: var(--ink-900);
  font-weight: var(--fw-medium);
}

.tbl-body .vl {
  font-family: var(--font-mono);
  color: var(--ink-600);
}

.tbl-body .chg {
  font-family: var(--font-mono);
  text-align: right;
  font-weight: var(--fw-medium);
}

.tbl-body .chg.up {
  color: #dc2626;
}

.tbl-body .chg.down {
  color: #16a34a;
}

/* ============ 金色专题卡 ============ */
.panel-gold {
  background: linear-gradient(135deg, var(--brand-navy) 0%, #11365b 100%);
  color: #fff;
  padding: 28px;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.panel-gold::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: var(--brand-gold);
}

.pg-label {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.22em;
  color: var(--brand-gold);
  margin-bottom: 12px;
}

.pg-title {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  margin: 0 0 12px;
  line-height: 1.3;
}

.pg-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0 0 18px;
}

.pg-link {
  display: inline-block;
  padding: 8px 16px;
  border: 1px solid var(--brand-gold);
  color: var(--brand-gold);
  font-size: 13px;
  letter-spacing: 0.08em;
  text-decoration: none;
  transition:
    background var(--dur-fast) var(--ease),
    color var(--dur-fast) var(--ease);
}

.pg-link:hover {
  background: var(--brand-gold);
  color: var(--brand-navy);
}

/* ============ 热门推荐 ============ */
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
  width: 28px;
}

.rn.top {
  color: var(--brand-gold-600);
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
</style>
