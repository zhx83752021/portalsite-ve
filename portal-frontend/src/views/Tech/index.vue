<template>
  <div class="tech-page">
    <div class="container">

      <!-- 页头 -->
      <header class="page-head">
        <div class="crumb">
          <router-link to="/">首页</router-link>
          <span class="sep">/</span>
          <span>科技</span>
        </div>
        <div class="head-row">
          <h1 class="title"><span class="sharp">//</span> 科技</h1>
          <p class="sub">前沿创新、数字经济、产业观察——以冷静的视角解码技术浪潮。</p>
        </div>

        <!-- 关键数据条 -->
        <div class="stats">
          <div class="stat">
            <div class="s-label">AI 大模型</div>
            <div class="s-val">17 款</div>
            <div class="s-meta">本月发布 · +23%</div>
          </div>
          <div class="stat">
            <div class="s-label">独角兽</div>
            <div class="s-val">312</div>
            <div class="s-meta">中国新上榜</div>
          </div>
          <div class="stat">
            <div class="s-label">半导体</div>
            <div class="s-val">¥6.8T</div>
            <div class="s-meta">产能规划</div>
          </div>
          <div class="stat">
            <div class="s-label">5G 基站</div>
            <div class="s-val">337 万</div>
            <div class="s-meta">累计建成</div>
          </div>
        </div>
      </header>

      <!-- Hero + 列表 -->
      <div class="layout">
        <main class="col-main">
          <section class="hero" v-if="heroArticle">
            <HeroHeadline :article="heroArticle" layout="split" />
          </section>

          <section class="subhero" v-if="subHeroes.length">
            <NewsListCard v-for="a in subHeroes" :key="a.id" :article="a" variant="tile" />
          </section>

          <section class="list">
            <SectionHeader title="深度报道" eyebrow="FEATURED" more="/news?cat=tech" />
            <div class="rows">
              <NewsListCard v-for="a in rowList" :key="a.id" :article="a" variant="row" />
            </div>
          </section>
        </main>

        <aside class="col-side">
          <div class="panel">
            <SectionHeader title="产品雷达" eyebrow="PRODUCT RADAR" />
            <ul class="radar">
              <li v-for="p in radar" :key="p.name">
                <span class="stage" :class="`st-${p.stage}`">{{ p.stage.toUpperCase() }}</span>
                <div class="rb">
                  <div class="rn">{{ p.name }}</div>
                  <div class="rd">{{ p.company }} · {{ p.desc }}</div>
                </div>
              </li>
            </ul>
          </div>

          <div class="panel-dark">
            <div class="pd-label">NEWSLETTER</div>
            <h3 class="pd-title">每周科技速递</h3>
            <p class="pd-desc">10 分钟读完一周最关键的产品、融资与技术突破。</p>
            <form class="pd-form" @submit.prevent>
              <input type="email" placeholder="输入邮箱" class="pd-input" />
              <button type="submit" class="pd-btn">订阅</button>
            </form>
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
const subHeroes = computed(() => articles.value.slice(1, 4))
const rowList = computed(() => articles.value.slice(4, 12))

const radar = ref([
  { stage: 'launch', name: '星河大模型 3.0', company: '智源研究院', desc: '多模态推理能力提升 40%' },
  { stage: 'beta', name: 'Neural OS', company: '某头部公司', desc: 'AI 原生操作系统测试版' },
  { stage: 'funding', name: 'QuantAI', company: '量子 AI 初创', desc: 'B 轮 2 亿美元融资' },
  { stage: 'launch', name: '国产 EDA v2', company: '华大九天', desc: '14nm 工艺全流程支持' },
  { stage: 'beta', name: 'RISC-V 服务器芯片', company: '玄铁实验室', desc: '首款 64 核量产测试' },
])

const fetchData = async () => {
  try {
    const categoryId = await resolveCategoryIdBySlug('tech')
    const res = await getArticleList({ page: 1, pageSize: 12, categoryId })
    articles.value = res.list || []
  } catch {
    articles.value = []
  }
}

onMounted(fetchData)
</script>

<style scoped>
.tech-page {
  padding-bottom: 64px;
  min-height: 60vh;
}

/* page head */
.page-head {
  padding: 40px 0 32px;
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

.head-row {
  margin-bottom: 32px;
}

.title {
  font-family: var(--font-mono);
  font-size: 40px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0 0 8px;
  letter-spacing: -0.01em;
}

.title .sharp {
  color: var(--brand-red);
  margin-right: 8px;
}

.sub {
  font-size: 15px;
  color: var(--ink-600);
  margin: 0;
  line-height: 1.7;
  max-width: 600px;
}

/* stats */
.stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0;
  border: 1px solid var(--line);
  border-radius: var(--radius-xs);
  background: #fff;
  overflow: hidden;
}

@media (max-width: 640px) {
  .stats {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat {
  padding: 20px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.stat:last-child,
.stat:nth-child(4n) {
  border-right: none;
}

@media (max-width: 640px) {
  .stat:nth-child(2n) {
    border-right: none;
  }
}

.s-label {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.16em;
  color: var(--ink-400);
  text-transform: uppercase;
  margin-bottom: 8px;
}

.s-val {
  font-family: var(--font-mono);
  font-size: 28px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
  line-height: 1;
  margin-bottom: 6px;
}

.s-meta {
  font-size: var(--fs-meta);
  color: var(--ink-600);
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

.subhero {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

@media (max-width: 960px) {
  .subhero {
    grid-template-columns: 1fr;
  }
}

.rows {
  display: flex;
  flex-direction: column;
}

/* radar */
.radar {
  list-style: none;
  margin: 0;
  padding: 0;
}

.radar li {
  display: flex;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--line);
  align-items: flex-start;
}

.radar li:last-child {
  border-bottom: none;
}

.stage {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.14em;
  padding: 3px 6px;
  border-radius: var(--radius-xs);
  flex-shrink: 0;
  font-weight: var(--fw-medium);
}

.st-launch {
  background: var(--brand-red);
  color: #fff;
}

.st-beta {
  background: var(--brand-navy);
  color: #fff;
}

.st-funding {
  background: var(--brand-gold);
  color: var(--brand-navy);
}

.rb {
  flex: 1;
  min-width: 0;
}

.rn {
  font-size: 14px;
  font-weight: var(--fw-medium);
  color: var(--ink-900);
  margin-bottom: 4px;
}

.rd {
  font-size: var(--fs-meta);
  color: var(--ink-600);
  line-height: 1.5;
}

/* newsletter */
.panel-dark {
  background: var(--brand-navy);
  color: #fff;
  padding: 28px;
  border-radius: var(--radius-md);
  position: relative;
  overflow: hidden;
}

.panel-dark::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 48px;
  height: 3px;
  background: #0e7490;
}

.pd-label {
  font-family: var(--font-mono);
  font-size: var(--fs-micro);
  letter-spacing: 0.22em;
  color: #0e7490;
  margin-bottom: 12px;
}

.pd-title {
  font-family: var(--font-display);
  font-size: 22px;
  color: #fff;
  margin: 0 0 12px;
}

.pd-desc {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.7;
  margin: 0 0 18px;
}

.pd-form {
  display: flex;
  gap: 0;
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.pd-input {
  flex: 1;
  background: transparent;
  border: none;
  color: #fff;
  padding: 10px 12px;
  font-family: var(--font-body);
  font-size: 13px;
  outline: none;
}

.pd-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.pd-btn {
  appearance: none;
  background: #0e7490;
  border: none;
  color: #fff;
  padding: 10px 18px;
  font-size: 13px;
  letter-spacing: 0.08em;
  cursor: pointer;
  transition: background var(--dur-fast) var(--ease);
}

.pd-btn:hover {
  background: #0c6077;
}
</style>
