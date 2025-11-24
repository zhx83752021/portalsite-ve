/**
 * 统一响应格式工具
 */

export interface ApiResponse<T = any> {
    code: number
    message: string
    data?: T
}

/**
 * 成功响应
 */
export const success = <T = any>(data?: T, message: string = '操作成功'): ApiResponse<T> => {
    return {
        code: 200,
        message,
        data
    }
}

/**
 * 失败响应
 */
export const error = (message: string = '操作失败', code: number = 400): ApiResponse => {
    return {
        code,
        message
    }
}

/**
 * 分页响应
 */
export const paginated = <T = any>(list: T[], total: number, page: number, pageSize: number): ApiResponse<{
    list: T[]
    total: number
    page: number
    pageSize: number
}> => {
    return success({
        list,
        total,
        page,
        pageSize
    })
}
