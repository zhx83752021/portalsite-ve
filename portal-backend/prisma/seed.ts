/**
 * 数据库种子文件
 * 用于初始化数据库数据
 */

import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
    console.log('🌱 开始播种数据...')

    // 清空现有数据（可选）
    console.log('清理现有数据...')
    await prisma.favorite.deleteMany()
    await prisma.comment.deleteMany()
    await prisma.article.deleteMany()
    await prisma.category.deleteMany()
    await prisma.user.deleteMany()

    // 1. 创建管理员用户
    console.log('创建用户...')
    const hashedPassword = await bcrypt.hash('admin123', 10)

    const admin = await prisma.user.create({
        data: {
            username: 'admin',
            email: 'admin@portal.com',
            password: hashedPassword,
            role: 'ADMIN',
            status: 1
        }
    })

    const user1 = await prisma.user.create({
        data: {
            username: '张三',
            email: 'zhangsan@example.com',
            password: await bcrypt.hash('123456', 10),
            role: 'USER',
            status: 1
        }
    })

    const user2 = await prisma.user.create({
        data: {
            username: '李四',
            email: 'lisi@example.com',
            password: await bcrypt.hash('123456', 10),
            role: 'USER',
            status: 1
        }
    })

    console.log(`✓ 创建了 ${3} 个用户`)

    // 2. 创建分类
    console.log('创建分类...')
    const categories = await Promise.all([
        prisma.category.create({
            data: { name: '时政', slug: 'politics', description: '时政新闻', sort: 1 }
        }),
        prisma.category.create({
            data: { name: '社会', slug: 'society', description: '社会新闻', sort: 2 }
        }),
        prisma.category.create({
            data: { name: '国际', slug: 'international', description: '国际新闻', sort: 3 }
        }),
        prisma.category.create({
            data: { name: '军事', slug: 'military', description: '军事新闻', sort: 4 }
        }),
        prisma.category.create({
            data: { name: '财经', slug: 'finance', description: '财经资讯', sort: 5 }
        }),
        prisma.category.create({
            data: { name: '体育', slug: 'sports', description: '体育赛事', sort: 6 }
        }),
        prisma.category.create({
            data: { name: '娱乐', slug: 'entertainment', description: '娱乐八卦', sort: 7 }
        }),
        prisma.category.create({
            data: { name: '科技', slug: 'tech', description: '科技前沿', sort: 8 }
        })
    ])

    console.log(`✓ 创建了 ${categories.length} 个分类`)

    // 3. 创建文章
    console.log('创建文章...')
    const articleTitles = [
        '重大突破！科技创新引领未来发展',
        '市场分析：经济形势持续向好',
        '体育赛事精彩回顾：激情对决',
        '娱乐圈动态：明星最新资讯',
        '国际局势：全球关注热点事件',
        '社会民生：关注百姓生活',
        '政策解读：新规出台影响深远',
        '科学研究：新发现改变认知',
        '文化艺术：传统与现代的碰撞',
        '教育改革：培养未来人才'
    ]

    const articles = []
    for (let i = 0; i < 50; i++) {
        const categoryIndex = i % categories.length
        const titleIndex = i % articleTitles.length

        const article = await prisma.article.create({
            data: {
                title: `${articleTitles[titleIndex]} - 第${i + 1}篇`,
                content: `<h2>文章引言</h2><p>这是一篇关于${categories[categoryIndex].name}的深度报道。${Array(10).fill('本文深入分析了当前形势，为读者提供了专业的见解和分析。').join('')}</p><h2>详细内容</h2><p>${Array(20).fill('文章详细内容，包含丰富的信息和专业分析。').join('')}</p><h2>总结</h2><p>综上所述，这是一个值得关注的重要话题。</p>`,
                summary: '本文深入分析了当前形势，为读者提供了专业的见解和分析，涵盖了多个重要方面，值得深入阅读和思考。',
                cover: i % 3 === 0 ? `https://picsum.photos/800/450?random=${i}` : null,
                categoryId: categories[categoryIndex].id,
                authorId: admin.id,
                views: Math.floor(Math.random() * 10000),
                status: 'PUBLISHED',
                tags: ['热点', '推荐', '精选'].slice(0, Math.floor(Math.random() * 3) + 1)
            }
        })

        articles.push(article)
    }

    console.log(`✓ 创建了 ${articles.length} 篇文章`)

    // 4. 创建评论
    console.log('创建评论...')
    const comments = []
    for (let i = 0; i < 30; i++) {
        const articleIndex = Math.floor(Math.random() * articles.length)
        const users = [user1, user2]
        const userIndex = i % users.length

        const comment = await prisma.comment.create({
            data: {
                articleId: articles[articleIndex].id,
                userId: users[userIndex].id,
                content: `这是第${i + 1}条评论。非常精彩的文章，受益匪浅！感谢作者的分享。`,
                status: 'APPROVED'
            }
        })

        comments.push(comment)

        // 创建一些回复
        if (i % 5 === 0 && i > 0) {
            await prisma.comment.create({
                data: {
                    articleId: articles[articleIndex].id,
                    userId: users[(userIndex + 1) % users.length].id,
                    content: '非常同意你的观点！',
                    parentId: comment.id,
                    status: 'APPROVED'
                }
            })
        }
    }

    console.log(`✓ 创建了 ${comments.length} 条评论`)

    // 5. 创建收藏
    console.log('创建收藏...')
    const favorites = []
    for (let i = 0; i < 10; i++) {
        const articleIndex = Math.floor(Math.random() * articles.length)

        try {
            const favorite = await prisma.favorite.create({
                data: {
                    userId: user1.id,
                    articleId: articles[articleIndex].id
                }
            })
            favorites.push(favorite)
        } catch (error) {
            // 忽略重复收藏错误
        }
    }

    console.log(`✓ 创建了 ${favorites.length} 条收藏记录`)

    console.log('\n✅ 数据播种完成！')
    console.log('\n📊 数据统计:')
    console.log(`  - 用户: ${3} 个`)
    console.log(`  - 分类: ${categories.length} 个`)
    console.log(`  - 文章: ${articles.length} 篇`)
    console.log(`  - 评论: ${comments.length + 6} 条 (包含回复)`)
    console.log(`  - 收藏: ${favorites.length} 条`)
    console.log('\n🔐 管理员账号:')
    console.log(`  - 邮箱: admin@portal.com`)
    console.log(`  - 密码: admin123`)
    console.log('\n👤 测试用户:')
    console.log(`  - 邮箱: zhangsan@example.com / lisi@example.com`)
    console.log(`  - 密码: 123456`)
}

main()
    .catch((e) => {
        console.error('❌ 播种数据时出错:', e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
