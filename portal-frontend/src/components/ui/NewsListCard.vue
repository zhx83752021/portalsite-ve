<!--
  NewsListCard — 新闻列表卡
  变体：
    - row:   水平（左缩略图 · 右标题摘要），新闻列表主用
    - tile:  竖排卡片（上图 · 下文字），网格用
    - line:  纯文本行 + 分类角标，侧栏 TopN
-->
<template>
  <article class="news-card" :class="[`v-${variant}`]" @click="goDetail">
    <!-- cover -->
    <div v-if="variant !== 'line'" class="cover">
      <img :src="article.cover || picUrl" :alt="article.title" loading="lazy" decoding="async" @error="onErr" />
      <span v-if="topRank" class="rank-badge" :class="{ gold: topRank <= 3 }">{{ topRank }}</span>
    </div>

    <!-- body -->
    <div class="body">
      <div class="top-meta">
        <MetaChip :label="article.categoryName || '新闻'" variant="ghost" :tone="chipTone" />
        <span v-if="variant !== 'line'" class="time">{{ relativeTime(article.createdAt) }}</span>
      </div>

      <h3 class="title">{{ article.title }}</h3>

      <p v-if="variant === 'row' && article.summary" class="summary">{{ article.summary }}</p>

      <div class="bottom-meta">
        <span v-if="article.authorName" class="author">{{ article.authorName }}</span>
        <span v-if="article.authorName" class="sep">·</span>
        <span class="views">{{ formatNum(article.views) }} 阅读</span>
        <span v-if="variant === 'line'" class="sep">·</span>
        <time v-if="variant === 'line'" class="time">{{ relativeTime(article.createdAt) }}</time>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Article } from '@/api/article'
import { relativeTime, formatNum, resolveSlug } from '@/utils/category'
import { buildCoverDataUrl } from './category-cover'
import MetaChip from './MetaChip.vue'

interface Props {
  article: Article & { categorySlug?: string }
  variant?: 'row' | 'tile' | 'line'
  topRank?: number
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'row',
})

const router = useRouter()
const slug = computed(() => resolveSlug(props.article))
const chipTone = computed<'red' | 'navy' | 'gold' | 'muted'>(() => {
  const s = slug.value
  if (s === 'entertainment') return 'red'
  if (s === 'finance') return 'gold'
  if (['sports', 'tech', 'technology'].includes(s)) return 'navy'
  return 'muted'
})

// 真实照片备用地址：按 articleId + slug 生成固定 picsum 随机图
const picUrl = computed(() =>
  `https://picsum.photos/seed/${props.article.id ?? slug.value}/640/360`
)

const goDetail = () => router.push(`/news/${props.article.id}`)

const onErr = (e: Event) => {
  const img = e.target as HTMLImageElement
  // 第一次失败 → 换 picsum 真实照片；picsum 也失败 → SVG 兜底
  if (!img.dataset.usedPic) {
    img.dataset.usedPic = '1'
    img.src = picUrl.value
  } else {
    img.src = buildCoverDataUrl(slug.value, props.article.title)
  }
}
</script>

<style scoped>
.news-card {
  cursor: pointer;
  display: flex;
  gap: 20px;
  padding: 20px 0;
  border-bottom: 1px solid var(--line);
  transition: background var(--dur-fast) var(--ease);
}

.news-card:last-child {
  border-bottom: none;
}

.news-card:hover .title {
  color: var(--brand-red);
}

/* ============ variants ============ */
.v-row {
  flex-direction: row;
  /* 避免 stretch + aspect-ratio 组合把封面横向撑出，盖住右侧文案 */
  align-items: flex-start;
}

.v-row .cover {
  flex: 0 0 200px;
  width: 200px;
  max-width: 200px;
  flex-shrink: 0;
  aspect-ratio: 16 / 10;
}

.v-tile {
  flex-direction: column;
  gap: 12px;
  padding: 0;
  border-bottom: none;
}

.v-tile .cover {
  aspect-ratio: 16 / 10;
}

.v-line {
  padding: 12px 0;
  gap: 8px;
  flex-direction: column;
}

/* ============ cover ============ */
.cover {
  position: relative;
  overflow: hidden;
  border-radius: var(--radius-sm);
  background: var(--mist-100);
}

.cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s var(--ease);
}

.news-card:hover .cover img {
  transform: scale(1.05);
}

.rank-badge {
  position: absolute;
  top: 8px;
  left: 8px;
  min-width: 24px;
  height: 24px;
  padding: 0 8px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: var(--ink-900);
  color: #fff;
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-micro);
  font-weight: var(--fw-bold);
  border-radius: var(--radius-xs);
  line-height: 1;
}

.rank-badge.gold {
  background: var(--brand-red);
  color: #fff;
}

/* ============ body ============ */
.body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 0;
}

.top-meta {
  display: flex;
  align-items: center;
  gap: 10px;
}

.top-meta .time {
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-meta);
  color: var(--ink-400);
}

.title {
  font-family: var(--font-display);
  font-size: var(--fs-h4);
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0;
  line-height: 1.4;
  letter-spacing: -0.005em;
  transition: color var(--dur-fast) var(--ease);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.v-tile .title {
  font-size: var(--fs-list);
}

.v-line .title {
  font-size: var(--fs-list);
  font-weight: var(--fw-medium);
  -webkit-line-clamp: 2;
}

.summary {
  font-size: var(--fs-list);
  line-height: 1.65;
  color: var(--ink-600);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.bottom-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-meta);
  color: var(--ink-400);
}

.sep {
  color: var(--ink-300);
}

@media (max-width: 640px) {
  .v-row {
    flex-direction: column;
    gap: 12px;
  }
  .v-row .cover {
    flex: none;
    width: 100%;
  }
  .title {
    font-size: var(--fs-list);
  }
}
</style>
