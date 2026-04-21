<!--
  HeroHeadline — 头条/焦点大卡
  版式：左 7 栏封面 / 右 5 栏文案；或纯叠加（overlay）
-->
<template>
  <article class="hero" :class="[`layout-${layout}`]" @click="goDetail">
    <!-- 媒体 -->
    <div class="media">
      <img :src="article.cover || picUrl" :alt="article.title" loading="eager" decoding="async"
        fetchpriority="high" @error="onErr" />
      <div v-if="layout === 'overlay'" class="scrim" />
    </div>

    <!-- 文案 -->
    <div class="text">
      <div class="eyebrow">
        <span class="dot" aria-hidden="true"></span>
        <span class="tag">{{ article.categoryName || '头条' }}</span>
        <span class="sep">·</span>
        <time class="time">{{ relativeTime(article.createdAt) }}</time>
      </div>
      <h2 class="headline">{{ article.title }}</h2>
      <p class="summary">{{ article.summary }}</p>
      <div class="meta">
        <span v-if="article.authorName" class="author">{{ article.authorName }}</span>
        <span v-if="article.authorName" class="dot-sep">·</span>
        <span class="views">{{ formatNum(article.views) }} 阅读</span>
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

interface Props {
  article: Article & { categorySlug?: string }
  layout?: 'split' | 'overlay'
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'split',
})

const router = useRouter()
const slug = computed(() => resolveSlug(props.article))

// hero 用宽图，seed 保证同一文章每次一致
const picUrl = computed(() =>
  `https://picsum.photos/seed/${props.article.id ?? slug.value}-hero/1280/720`
)

const goDetail = () => router.push(`/news/${props.article.id}`)

const onErr = (e: Event) => {
  const img = e.target as HTMLImageElement
  if (!img.dataset.usedPic) {
    img.dataset.usedPic = '1'
    img.src = picUrl.value
  } else {
    img.src = buildCoverDataUrl(slug.value, props.article.title)
  }
}
</script>

<style scoped>
.hero {
  display: grid;
  cursor: pointer;
  background: #fff;
  overflow: hidden;
}

.layout-split {
  grid-template-columns: minmax(0, 7fr) minmax(0, 5fr);
  gap: 32px;
  align-items: stretch;
}

.layout-overlay {
  grid-template-columns: 1fr;
  position: relative;
  min-height: 520px;
  border-radius: var(--radius-md);
}

.layout-overlay .text {
  position: absolute;
  left: 40px;
  right: 40px;
  bottom: 40px;
  color: #fff;
}

.layout-overlay .eyebrow .tag {
  color: var(--brand-gold);
}

.layout-overlay .headline {
  color: #fff;
}

.layout-overlay .summary {
  color: rgba(255, 255, 255, 0.88);
}

.layout-overlay .meta,
.layout-overlay .meta .dot-sep {
  color: rgba(255, 255, 255, 0.68);
}

/* ============ media ============ */
.media {
  position: relative;
  aspect-ratio: 16 / 9;
  overflow: hidden;
  border-radius: var(--radius-md);
  background: var(--mist-100);
}

.layout-overlay .media {
  position: absolute;
  inset: 0;
  border-radius: var(--radius-md);
}

.media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s var(--ease);
}

.hero:hover .media img {
  transform: scale(1.04);
}

.scrim {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0) 40%,
    rgba(6, 26, 51, 0.85) 100%
  );
}

/* ============ text ============ */
.text {
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 14px;
  padding: 8px 0;
}

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-family: var(--font-body);
  font-size: var(--fs-meta);
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--ink-400);
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--brand-red);
  animation: pulse 2.4s ease-out infinite;
}

@keyframes pulse {
  0%,
  100% { opacity: 1; }
  50% { opacity: 0.4; }
}

.tag {
  color: var(--brand-red);
  font-weight: var(--fw-medium);
}

.sep {
  color: var(--ink-300);
}

.time {
  color: var(--ink-400);
}

.headline {
  font-family: var(--font-display);
  font-size: var(--fs-display-2);
  font-weight: var(--fw-bold);
  line-height: 1.2;
  color: var(--ink-900);
  margin: 0;
  letter-spacing: -0.015em;
  transition: color var(--dur-base) var(--ease);
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.hero:hover .headline {
  color: var(--brand-red);
}

.summary {
  font-family: var(--font-body);
  font-size: var(--fs-body);
  line-height: 1.7;
  color: var(--ink-600);
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.meta {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: var(--fs-meta);
  color: var(--ink-400);
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
}

.dot-sep {
  color: var(--ink-300);
}

@media (max-width: 960px) {
  .layout-split {
    grid-template-columns: 1fr;
    gap: 20px;
  }
  .headline {
    font-size: 28px;
  }
  .layout-overlay {
    min-height: 360px;
  }
  .layout-overlay .text {
    left: 20px;
    right: 20px;
    bottom: 24px;
  }
}
</style>
