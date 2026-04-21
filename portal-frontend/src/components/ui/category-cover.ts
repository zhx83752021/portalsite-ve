/**
 * 分类封面工具：渐变色、Lucide 图标、data-URL 生成
 * 组件 CategoryCover.vue 和降级 onError 都从这里取值
 */

export interface GradientStop {
  from: string
  to: string
}

export const GRADIENT_MAP: Record<string, GradientStop> = {
  politics: { from: '#0A2540', to: '#061A33' },
  society: { from: '#0A2540', to: '#1E3A5F' },
  international: { from: '#0A2540', to: '#0E4C6E' },
  military: { from: '#0A2540', to: '#3B3B3B' },
  finance: { from: '#0A2540', to: '#C9A961' },
  sports: { from: '#0A2540', to: '#C0392B' },
  entertainment: { from: '#C0392B', to: '#C9A961' },
  tech: { from: '#0A2540', to: '#0E7490' },
  technology: { from: '#0A2540', to: '#0E7490' },
  news: { from: '#0A2540', to: '#11365B' },
}

/**
 * Lucide 风格线性图标路径（viewBox 0 0 24 24）
 */
export const ICON_MAP: Record<string, string> = {
  politics:
    '<path d="M3 22h18"/><path d="M6 18v-6"/><path d="M10 18v-6"/><path d="M14 18v-6"/><path d="M18 18v-6"/><path d="M12 2 2 9h20Z"/>',
  society:
    '<circle cx="9" cy="7" r="4"/><path d="M17 11a4 4 0 0 0 0-8"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/>',
  international:
    '<circle cx="12" cy="12" r="10"/><path d="M2 12h20"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>',
  military:
    '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  finance:
    '<polyline points="3 17 9 11 13 15 21 7"/><polyline points="14 7 21 7 21 14"/>',
  sports:
    '<path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6"/><path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18"/><path d="M4 22h16"/><path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22"/><path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22"/><path d="M18 2H6v7a6 6 0 0 0 12 0V2Z"/>',
  entertainment:
    '<rect x="2" y="2" width="20" height="20" rx="2"/><path d="M7 2v20"/><path d="M17 2v20"/><path d="M2 12h20"/><path d="M2 7h5"/><path d="M2 17h5"/><path d="M17 17h5"/><path d="M17 7h5"/>',
  tech:
    '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  technology:
    '<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M15 2v2"/><path d="M15 20v2"/><path d="M2 15h2"/><path d="M2 9h2"/><path d="M20 15h2"/><path d="M20 9h2"/><path d="M9 2v2"/><path d="M9 20v2"/>',
  news:
    '<circle cx="9" cy="7" r="4"/><path d="M17 11a4 4 0 0 0 0-8"/><path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/><path d="M21 21v-2a4 4 0 0 0-3-3.87"/>',
}

const defaultGradient = GRADIENT_MAP.news!
const defaultIcon = ICON_MAP.news!

export function getGradient(slug: string): GradientStop {
  return GRADIENT_MAP[slug] ?? defaultGradient
}

export function getIcon(slug: string): string {
  return ICON_MAP[slug] ?? defaultIcon
}

/**
 * 把分类封面导出成 data-URL，用于 <img onerror> 降级
 */
export function buildCoverDataUrl(slug: string, title = ''): string {
  const g = getGradient(slug)
  const icon = getIcon(slug)
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" preserveAspectRatio="xMidYMid slice">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0" stop-color="${g.from}"/><stop offset="1" stop-color="${g.to}"/>
</linearGradient></defs>
<rect width="640" height="360" fill="url(#g)"/>
<g transform="translate(272,132)" fill="none" stroke="rgba(255,255,255,0.92)" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
<svg viewBox="0 0 24 24" width="96" height="96">${icon}</svg></g>
${title ? `<text x="320" y="312" font-family="Microsoft YaHei, PingFang SC, sans-serif" font-size="22" font-weight="700" fill="#fff" text-anchor="middle">${escapeXml(title)}</text>` : ''}
<text x="616" y="340" font-family="IBM Plex Sans, monospace" font-size="12" letter-spacing="2" fill="rgba(255,255,255,0.6)" text-anchor="end">${slug.toUpperCase()}</text>
</svg>`
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}

/**
 * 挂到 window 以便 <img onerror="this.src = __coverFallback(...)"> 调用
 */
if (typeof window !== 'undefined') {
  ;(window as any).__coverFallback = buildCoverDataUrl
}
