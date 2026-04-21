<template>
  <nav class="underline-tabs" role="tablist">
    <button v-for="tab in tabs" :key="tab.value" type="button" class="tab" :class="{ active: modelValue === tab.value }"
      role="tab" :aria-selected="modelValue === tab.value" @click="$emit('update:modelValue', tab.value)">
      {{ tab.label }}
      <span v-if="tab.count !== undefined" class="count">{{ tab.count }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts">
export interface TabItem {
  label: string
  value: string | number
  count?: number
}

interface Props {
  tabs: TabItem[]
  modelValue: string | number
}

defineProps<Props>()
defineEmits<{ (e: 'update:modelValue', v: string | number): void }>()
</script>

<style scoped>
.underline-tabs {
  display: flex;
  gap: 4px;
  border-bottom: 1px solid var(--line);
  overflow-x: auto;
  scrollbar-width: none;
}

.underline-tabs::-webkit-scrollbar {
  display: none;
}

.tab {
  appearance: none;
  background: transparent;
  border: none;
  padding: 12px 18px;
  cursor: pointer;
  font-family: var(--font-body);
  font-size: var(--fs-list);
  font-weight: var(--fw-medium);
  color: var(--ink-600);
  position: relative;
  white-space: nowrap;
  transition: color var(--dur-fast) var(--ease);
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tab::after {
  content: '';
  position: absolute;
  left: 18px;
  right: 18px;
  bottom: -1px;
  height: 2px;
  background: transparent;
  transition: background var(--dur-base) var(--ease);
}

.tab:hover {
  color: var(--brand-red);
}

.tab.active {
  color: var(--ink-900);
  font-weight: var(--fw-bold);
}

.tab.active::after {
  background: var(--brand-red);
}

.count {
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-micro);
  color: var(--ink-400);
  background: var(--mist-100);
  padding: 2px 6px;
  border-radius: var(--radius-xs);
}

.tab.active .count {
  background: var(--brand-red);
  color: #fff;
}
</style>
