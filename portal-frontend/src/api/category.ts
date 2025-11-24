import { request } from './request'

export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    parentId?: number
    children?: Category[]
}

// 获取分类列表
export const getCategoryList = () => {
    return request.get<Category[]>('/categories')
}

// 获取分类详情
export const getCategoryDetail = (id: number) => {
    return request.get<Category>(`/categories/${id}`)
}

// 获取分类树
export const getCategoryTree = () => {
    return request.get<Category[]>('/categories/tree')
}
