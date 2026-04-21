<!--
  CategoryCover — SVG 渐变占位封面
  按 slug 输出分类色 + Lucide 线性图标 + slug 水印
  作为全站 <img onerror> 降级源；列表缩略图默认直接用它
-->
<template>
  <div class="category-cover" :style="{ aspectRatio: `${width} / ${height}` }" :aria-label="ariaLabel">
    <svg :viewBox="`0 0 ${width} ${height}`" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice"
      role="img" :aria-label="ariaLabel">
      <defs>
        <linearGradient :id="gradientId" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" :stop-color="colors.from" />
          <stop offset="100%" :stop-color="colors.to" />
        </linearGradient>
      </defs>

      <rect :width="width" :height="height" :fill="`url(#${gradientId})`" />

      <!-- 左上短标尺（头条样式） -->
      <rect v-if="showRuler" x="24" y="24" width="48" height="4" fill="#C0392B" />

      <!-- 中心分类图标 -->
      <g :transform="`translate(${width / 2 - iconSize / 2}, ${height / 2 - iconSize / 2})`" fill="none"
        stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <svg viewBox="0 0 24 24" :width="iconSize" :height="iconSize">
          <g v-html="iconPath" />
        </svg>
      </g>

      <!-- 标题（可选） -->
      <text v-if="title" :x="width / 2" :y="height - 48" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="22"
        font-weight="700" fill="#fff" text-anchor="middle" opacity="0.96">
        {{ title }}
      </text>

      <!-- 右下水印 -->
      <text :x="width - 24" :y="height - 20" font-family="IBM Plex Sans, monospace" font-size="12" letter-spacing="2"
        fill="rgba(255,255,255,0.6)" text-anchor="end">
        {{ slug.toUpperCase() }}
      </text>
    </svg>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { getGradient, getIcon } from './category-cover'

interface Props {
  slug?: string
  title?: string
  width?: number
  height?: number
  showRuler?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  slug: 'news',
  title: '',
  width: 640,
  height: 360,
  showRuler: false,
})

const colors = computed(() => getGradient(props.slug))
const iconPath = computed(() => getIcon(props.slug))
const iconSize = computed(() => Math.round(Math.min(props.width, props.height) * 0.26))

const uid = Math.random().toString(36).slice(2, 8)
const gradientId = computed(() => `cov-g-${props.slug}-${uid}`)
const ariaLabel = computed(() => props.title || `${props.slug} 封面`)
</script>

<style scoped>
.category-cover {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: var(--brand-navy);
  border-radius: inherit;
}

.category-cover svg {
  width: 100%;
  height: 100%;
  display: block;
}
</style>
