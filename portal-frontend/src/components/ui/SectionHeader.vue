<template>
  <header class="section-header">
    <div class="left">
      <span v-if="eyebrow" class="eyebrow">{{ eyebrow }}</span>
      <h2 class="title">{{ title }}</h2>
      <span v-if="count !== undefined" class="count">{{ count }}</span>
    </div>
    <div class="right">
      <router-link v-if="more" :to="more" class="more">
        查看全部
        <span class="arrow" aria-hidden="true">→</span>
      </router-link>
      <slot name="right" />
    </div>
  </header>
</template>

<script setup lang="ts">
interface Props {
  title: string
  eyebrow?: string
  count?: number
  more?: string
}
defineProps<Props>()
</script>

<style scoped>
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16px;
  padding-bottom: 12px;
  margin-bottom: 20px;
  border-bottom: 1px solid var(--line);
  position: relative;
}

.section-header::after {
  content: '';
  position: absolute;
  left: 0;
  bottom: -1px;
  width: 48px;
  height: 2px;
  background: var(--brand-red);
}

.left {
  display: flex;
  align-items: baseline;
  gap: 12px;
  min-width: 0;
}

.eyebrow {
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--brand-red);
  font-weight: var(--fw-medium);
}

.title {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  margin: 0;
  line-height: 1.15;
  letter-spacing: -0.01em;
}

.count {
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-meta);
  color: var(--ink-400);
}

.right {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-shrink: 0;
}

.more {
  font-family: var(--font-body);
  font-size: var(--fs-meta);
  color: var(--ink-600);
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: color var(--dur-fast) var(--ease);
}

.more .arrow {
  display: inline-block;
  transition: transform var(--dur-base) var(--ease);
}

.more:hover {
  color: var(--brand-red);
}

.more:hover .arrow {
  transform: translateX(3px);
}

@media (max-width: 640px) {
  .title {
    font-size: var(--fs-h3);
  }
}
</style>
