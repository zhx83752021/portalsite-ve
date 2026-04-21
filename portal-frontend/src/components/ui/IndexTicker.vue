<template>
  <div class="idx-ticker">
    <span class="label">MARKET</span>
    <div class="track">
      <div v-for="(it, i) in items" :key="it.code + i" class="idx-card" :class="dirClass(it.chg)">
        <div class="idx-head">
          <span class="idx-code">{{ it.code }}</span>
          <span class="idx-name">{{ it.name }}</span>
        </div>
        <div class="idx-val">{{ it.value.toLocaleString('en-US') }}</div>
        <div class="idx-chg">
          <span class="arrow" aria-hidden="true">{{ it.chg > 0 ? '▲' : it.chg < 0 ? '▼' : '·' }}</span>
          <span>{{ it.chg > 0 ? '+' : '' }}{{ it.chg.toFixed(2) }}%</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface IdxItem {
  code: string
  name: string
  value: number
  chg: number
}
defineProps<{ items: IdxItem[] }>()

const dirClass = (c: number) => ({ up: c > 0, down: c < 0, flat: c === 0 })
</script>

<style scoped>
.idx-ticker {
  display: flex;
  align-items: stretch;
  background: var(--brand-navy-900);
  border: 1px solid var(--brand-navy-600);
  border-radius: var(--radius-xs);
  overflow: hidden;
  color: #fff;
}

.label {
  display: inline-flex;
  align-items: center;
  padding: 0 18px;
  font-family: var(--font-body);
  font-size: var(--fs-micro);
  letter-spacing: 0.2em;
  color: var(--brand-gold);
  background: var(--brand-navy-900);
  border-right: 1px solid rgba(255, 255, 255, 0.08);
}

.track {
  flex: 1;
  display: grid;
  grid-auto-flow: column;
  grid-auto-columns: minmax(180px, 1fr);
  overflow-x: auto;
  scrollbar-width: none;
}

.track::-webkit-scrollbar {
  display: none;
}

.idx-card {
  padding: 12px 18px;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 180px;
  transition: background var(--dur-fast) var(--ease);
}

.idx-card:hover {
  background: rgba(255, 255, 255, 0.04);
}

.idx-head {
  display: flex;
  gap: 8px;
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-micro);
  letter-spacing: 0.04em;
}

.idx-code {
  color: rgba(255, 255, 255, 0.4);
}

.idx-name {
  color: rgba(255, 255, 255, 0.82);
}

.idx-val {
  font-family: var(--font-mono);
  font-size: var(--fs-h4);
  font-weight: var(--fw-medium);
  color: #fff;
  font-feature-settings: 'tnum' on, 'lnum' on;
}

.idx-chg {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-body);
  font-variant-numeric: tabular-nums;
  font-size: var(--fs-meta);
}

.idx-card.up .idx-chg {
  color: #ff6b5b;
}

.idx-card.down .idx-chg {
  color: #5ee1a7;
}

.idx-card.flat .idx-chg {
  color: rgba(255, 255, 255, 0.5);
}

.arrow {
  font-size: var(--fs-micro);
}

@media (max-width: 640px) {
  .label {
    display: none;
  }
  .idx-card {
    min-width: 140px;
    padding: 10px 14px;
  }
  .idx-val {
    font-size: var(--fs-list);
  }
}
</style>
