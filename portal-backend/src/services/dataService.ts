/**
 * 数据服务层 - 模拟数据库操作
 * 在实际项目中，这里应该连接真实数据库
 */

import { Article, ArticleQueryDTO, ArticleListResponse } from '../models/Article'
import { Category } from '../models/Category'
import { Comment, CommentQueryDTO, CommentListResponse } from '../models/Comment'
import { User, UserInfo } from '../models/User'

// 模拟数据存储
class DataStore {
    private articles: Article[] = []
    private categories: Category[] = []
    private comments: Comment[] = []
    private users: User[] = []
    private nextArticleId = 1
    private nextCategoryId = 1
    private nextCommentId = 1
    private nextUserId = 1

    constructor() {
        this.initMockData()
    }

    private initMockData() {
        // 初始化分类
        this.categories = [
            { id: 1, name: '时政', slug: 'politics', description: '时政新闻', createdAt: new Date().toISOString() },
            { id: 2, name: '社会', slug: 'society', description: '社会新闻', createdAt: new Date().toISOString() },
            { id: 3, name: '国际', slug: 'international', description: '国际新闻', createdAt: new Date().toISOString() },
            { id: 4, name: '军事', slug: 'military', description: '军事新闻', createdAt: new Date().toISOString() },
            { id: 5, name: '财经', slug: 'finance', description: '财经资讯', createdAt: new Date().toISOString() },
            { id: 6, name: '体育', slug: 'sports', description: '体育赛事', createdAt: new Date().toISOString() },
            { id: 7, name: '娱乐', slug: 'entertainment', description: '娱乐八卦', createdAt: new Date().toISOString() },
            { id: 8, name: '科技', slug: 'tech', description: '科技前沿', createdAt: new Date().toISOString() }
        ]
        this.nextCategoryId = 9

        // 初始化管理员用户
        this.users = [
            {
                id: 1,
                username: 'admin',
                email: 'admin@portal.com',
                password: '$2a$10$YourHashedPasswordHere', // 实际应该是加密后的密码
                role: 'admin',
                status: 1,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ]
        this.nextUserId = 2

        // 初始化文章
        this.generateMockArticles(50)
    }

    private generateMockArticles(count: number) {
        const titles = [
            '重大突破！科技创新引领未来发展',
            '市场分析：经济形势持续向好',
            '体育赛事精彩回顾：激情对决',
            '娱乐圈动态：明星最新资讯',
            '国际局势：全球关注热点事件',
            '社会民生：关注百姓生活',
            '政策解读：新规出台影响深远',
            '科学研究：新发现改变认知'
        ]

        for (let i = 0; i < count; i++) {
            const categoryId = (i % 8) + 1
            const category = this.categories.find(c => c.id === categoryId)

            this.articles.push({
                id: this.nextArticleId++,
                title: `${titles[i % titles.length]} - 第${i + 1}篇`,
                content: `<p>这是文章的详细内容。${Array(20).fill('本文深入分析了当前形势，为读者提供了专业的见解和分析。').join('')}</p>`,
                summary: '本文深入分析了当前形势，为读者提供了专业的见解和分析，值得关注。',
                cover: i % 3 === 0 ? `https://picsum.photos/800/450?random=${i}` : undefined,
                categoryId,
                categoryName: category?.name,
                authorId: 1,
                authorName: 'admin',
                views: Math.floor(Math.random() * 10000),
                status: 1,
                tags: ['热点', '推荐', '精选'].slice(0, Math.floor(Math.random() * 3) + 1),
                createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
                updatedAt: new Date().toISOString()
            })
        }
    }

    // 文章相关方法
    getArticles(query: ArticleQueryDTO): ArticleListResponse {
        let filtered = this.articles.filter(a => a.status === 1)

        if (query.categoryId) {
            filtered = filtered.filter(a => a.categoryId === query.categoryId)
        }

        if (query.keyword) {
            const keyword = query.keyword.toLowerCase()
            filtered = filtered.filter(a =>
                a.title.toLowerCase().includes(keyword) ||
                a.summary.toLowerCase().includes(keyword)
            )
        }

        // 排序
        const sortBy = query.sortBy || 'createdAt'
        const order = query.order || 'desc'
        filtered.sort((a, b) => {
            const aVal = a[sortBy]
            const bVal = b[sortBy]
            return order === 'asc' ?
                (aVal > bVal ? 1 : -1) :
                (aVal < bVal ? 1 : -1)
        })

        // 分页
        const page = query.page || 1
        const pageSize = query.pageSize || 20
        const start = (page - 1) * pageSize
        const end = start + pageSize

        return {
            list: filtered.slice(start, end),
            total: filtered.length,
            page,
            pageSize
        }
    }

    getArticleById(id: number): Article | null {
        const article = this.articles.find(a => a.id === id)
        if (article) {
            // 增加浏览量
            article.views++
        }
        return article || null
    }

    getHotArticles(limit: number = 10): Article[] {
        return [...this.articles]
            .filter(a => a.status === 1)
            .sort((a, b) => b.views - a.views)
            .slice(0, limit)
    }

    getRecommendArticles(limit: number = 10): Article[] {
        return [...this.articles]
            .filter(a => a.status === 1)
            .sort(() => Math.random() - 0.5)
            .slice(0, limit)
    }

    createArticle(article: Omit<Article, 'id' | 'views' | 'createdAt' | 'updatedAt'>): Article {
        const category = this.categories.find(c => c.id === article.categoryId)
        const newArticle: Article = {
            ...article,
            id: this.nextArticleId++,
            categoryName: category?.name,
            views: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        this.articles.push(newArticle)
        return newArticle
    }

    updateArticle(id: number, updates: Partial<Article>): Article | null {
        const index = this.articles.findIndex(a => a.id === id)
        if (index === -1) return null

        this.articles[index] = {
            ...this.articles[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        return this.articles[index]
    }

    deleteArticle(id: number): boolean {
        const index = this.articles.findIndex(a => a.id === id)
        if (index === -1) return false
        this.articles.splice(index, 1)
        return true
    }

    // 分类相关方法
    getCategories(): Category[] {
        return this.categories
    }

    getCategoryById(id: number): Category | null {
        return this.categories.find(c => c.id === id) || null
    }

    createCategory(category: Omit<Category, 'id' | 'createdAt'>): Category {
        const newCategory: Category = {
            ...category,
            id: this.nextCategoryId++,
            createdAt: new Date().toISOString()
        }
        this.categories.push(newCategory)
        return newCategory
    }

    updateCategory(id: number, updates: Partial<Category>): Category | null {
        const index = this.categories.findIndex(c => c.id === id)
        if (index === -1) return null

        this.categories[index] = {
            ...this.categories[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        return this.categories[index]
    }

    deleteCategory(id: number): boolean {
        const index = this.categories.findIndex(c => c.id === id)
        if (index === -1) return false
        this.categories.splice(index, 1)
        return true
    }

    // 评论相关方法
    getComments(query: CommentQueryDTO): CommentListResponse {
        let filtered = this.comments

        if (query.articleId) {
            filtered = filtered.filter(c => c.articleId === query.articleId)
        }

        if (query.userId) {
            filtered = filtered.filter(c => c.userId === query.userId)
        }

        if (query.status !== undefined) {
            filtered = filtered.filter(c => c.status === query.status)
        }

        // 分页
        const page = query.page || 1
        const pageSize = query.pageSize || 20
        const start = (page - 1) * pageSize
        const end = start + pageSize

        return {
            list: filtered.slice(start, end),
            total: filtered.length,
            page,
            pageSize
        }
    }

    createComment(comment: Omit<Comment, 'id' | 'likes' | 'createdAt'>): Comment {
        const newComment: Comment = {
            ...comment,
            id: this.nextCommentId++,
            likes: 0,
            createdAt: new Date().toISOString()
        }
        this.comments.push(newComment)
        return newComment
    }

    // 用户相关方法
    getUserByEmail(email: string): User | null {
        return this.users.find(u => u.email === email) || null
    }

    getUserById(id: number): User | null {
        return this.users.find(u => u.id === id) || null
    }

    createUser(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): User {
        const newUser: User = {
            ...user,
            id: this.nextUserId++,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
        this.users.push(newUser)
        return newUser
    }

    updateUser(id: number, updates: Partial<User>): User | null {
        const index = this.users.findIndex(u => u.id === id)
        if (index === -1) return null

        this.users[index] = {
            ...this.users[index],
            ...updates,
            updatedAt: new Date().toISOString()
        }
        return this.users[index]
    }

    getUserInfo(id: number): UserInfo | null {
        const user = this.getUserById(id)
        if (!user) return null

        return {
            id: user.id,
            username: user.username,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            createdAt: user.createdAt
        }
    }
}

// 导出单例
export const dataService = new DataStore()
