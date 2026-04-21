import { Request, Response, NextFunction } from 'express'
import { categoryService } from '../services/prismaService'

export const getCategories = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    categoryService
        .getCategories()
        .then((categories) => {
            res.json({
                code: 200,
                message: 'success',
                data: categories.map((c) => ({
                    id: c.id,
                    name: c.name,
                    slug: c.slug,
                    description: c.description
                }))
            })
        })
        .catch(next)
}
