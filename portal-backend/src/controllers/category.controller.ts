import { Request, Response, NextFunction } from 'express'

const categories = [
    { id: 1, name: '时政', slug: 'politics', description: '时政新闻' },
    { id: 2, name: '社会', slug: 'society', description: '社会新闻' },
    { id: 3, name: '国际', slug: 'international', description: '国际新闻' },
    { id: 4, name: '军事', slug: 'military', description: '军事新闻' },
    { id: 5, name: '财经', slug: 'finance', description: '财经资讯' },
    { id: 6, name: '体育', slug: 'sports', description: '体育赛事' },
    { id: 7, name: '娱乐', slug: 'entertainment', description: '娱乐八卦' },
    { id: 8, name: '科技', slug: 'tech', description: '科技前沿' }
]

export const getCategories = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        res.json({
            code: 200,
            message: 'success',
            data: categories
        })
    } catch (error) {
        next(error)
    }
}
