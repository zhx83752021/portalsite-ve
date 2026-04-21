<template>
  <span class="meta-chip" :class="[`variant-${variant}`, `tone-${tone}`]">
    <span v-if="dot" class="dot" :style="{ background: dotColor }"></span>
    <slot>{{ label }}</slot>
  </span>
</template>

<script setup lang="ts">
interface Props {
  label?: string
  variant?: 'solid' | 'outline' | 'ghost'
  tone?: 'navy' | 'red' | 'gold' | 'muted'
  dot?: boolean
  dotColor?: string
}
withDefaults(defineProps<Props>(), {
  label: '',
  variant: 'outline',
  tone: 'muted',
  dot: false,
  dotColor: '#C0392B',
})
</script>

<style scoped>
.meta-chip {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 2px 10px;
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  font-weight: var(--fw-medium);
  letter-spacing: 0.06em;
  border-radius: var(--radius-xs);
  line-height: 1.6;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  display: inline-block;
}

/* ============ variants ============ */
.variant-outline {
  background: transparent;
  border: 1px solid var(--line);
  color: var(--ink-600);
}

.variant-solid {
  background: var(--ink-900);
  color: #fff;
  border: 1px solid transparent;
}

.variant-ghost {
  background: var(--mist-100);
  color: var(--ink-600);
  border: 1px solid transparent;
}

/* ============ tones ============ */
.variant-outline.tone-navy {
  color: var(--brand-navy);
  border-color: var(--brand-navy);
}

.variant-solid.tone-navy {
  background: var(--brand-navy);
}

.variant-ghost.tone-navy {
  background: var(--el-color-primary-light-9);
  color: var(--brand-navy);
}

.variant-outline.tone-red {
  color: var(--brand-red);
  border-color: var(--brand-red);
}

.variant-solid.tone-red {
  background: var(--brand-red);
}

.variant-ghost.tone-red {
  background: rgba(192, 57, 43, 0.08);
  color: var(--brand-red);
}

.variant-outline.tone-gold {
  color: var(--brand-gold-600);
  border-color: var(--brand-gold);
}

.variant-solid.tone-gold {
  background: var(--brand-gold);
  color: var(--brand-navy);
}
</style>
