import { getCategoryList, type Category } from '@/api/category'

/**
 * 分类名（中文）→ slug 映射，在后端未返回 slug 时作为降级
 */
export const NAME_TO_SLUG: Record<string, string> = {
  时政: 'politics',
  社会: 'society',
  国际: 'international',
  军事: 'military',
  财经: 'finance',
  体育: 'sports',
  娱乐: 'entertainment',
  科技: 'tech',
  头条: 'politics',
  政务: 'politics',
}

export const SLUG_TO_NAME: Record<string, string> = Object.fromEntries(
  Object.entries(NAME_TO_SLUG).map(([k, v]) => [v, k]),
)

export function resolveSlug(input?: { categorySlug?: string; categoryName?: string }): string {
  if (!input) return 'news'
  if (input.categorySlug) return input.categorySlug
  if (input.categoryName && NAME_TO_SLUG[input.categoryName]) {
    return NAME_TO_SLUG[input.categoryName] as string
  }
  return 'news'
}

/**
 * 相对时间
 */
export function relativeTime(time?: string | Date): string {
  if (!time) return ''
  const date = time instanceof Date ? time : new Date(time)
  if (Number.isNaN(date.getTime())) return ''
  const diff = Date.now() - date.getTime()
  if (diff < 60_000) return '刚刚'
  if (diff < 3_600_000) return `${Math.floor(diff / 60_000)} 分钟前`
  if (diff < 86_400_000) return `${Math.floor(diff / 3_600_000)} 小时前`
  if (diff < 6 * 86_400_000) return `${Math.floor(diff / 86_400_000)} 天前`
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: '2-digit', day: '2-digit' })
}

/**
 * 分类缓存 —— 避免每个频道页都重复拉取 /categories
 * 返回 slug → id 的映射；失败时回空对象，由调用方兜底。
 */
let categoryCache: Promise<Category[]> | null = null

export function getCachedCategories(): Promise<Category[]> {
  if (!categoryCache) {
    categoryCache = getCategoryList().catch((err) => {
      categoryCache = null
      throw err
    })
  }
  return categoryCache
}

export async function resolveCategoryIdBySlug(slug: string): Promise<number | undefined> {
  try {
    const list = await getCachedCategories()
    const bySlug = list.find((c) => c.slug === slug)
    if (bySlug) return bySlug.id
    const zhName = SLUG_TO_NAME[slug]
    if (zhName) return list.find((c) => c.name === zhName)?.id
    return undefined
  } catch {
    return undefined
  }
}

/**
 * 数字千位
 */
export function formatNum(n?: number): string {
  if (typeof n !== 'number') return '0'
  if (n >= 10000) return `${(n / 10000).toFixed(1)}万`
  return n.toLocaleString('en-US')
}
