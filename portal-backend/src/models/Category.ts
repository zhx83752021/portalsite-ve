/**
 * 分类数据模型
 */
export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    parentId?: number
    sort?: number
    createdAt: string
    updatedAt?: string
}

/**
 * 分类创建数据
 */
export interface CategoryCreateDTO {
    name: string
    slug: string
    description?: string
    parentId?: number
    sort?: number
}

/**
 * 分类更新数据
 */
export interface CategoryUpdateDTO {
    name?: string
    slug?: string
    description?: string
    parentId?: number
    sort?: number
}
