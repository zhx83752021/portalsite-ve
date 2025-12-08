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

    // 真实评论内容
    const realComments = [
        '分析很到位，对当前形势有了更清晰的认识，感谢分享！',
        '这篇文章写得非常专业，数据详实，观点独到，值得深入学习。',
        '政策解读很及时，对我们企业发展有很大帮助。',
        '作为从业者，对文章提到的问题深有感触，希望能得到更多关注。',
        '内容详实，逻辑清晰，为我们提供了很好的参考。',
        '文章视角独特，提出的建议很有建设性，期待看到更多这样的内容。',
        '深度好文，让我对这个领域有了更全面的了解。',
        '数据支撑充分，结论令人信服，确实是高质量的分析文章。',
        '作者的专业素养很高，分析问题很透彻。',
        '这个话题非常重要，文章分析得很全面，受益良多。',
        '政策落地需要时间，期待能看到实际成效。',
        '从多个角度分析问题，给我很大启发。',
        '文章提到的趋势值得关注，对未来发展有重要意义。',
        '作为普通民众，很关心这些政策如何惠及百姓。',
        '专业的分析，通俗的表达，很容易理解。',
        '这样的深度报道太少了，希望能多看到这样的文章。',
        '数据很有说服力，让人对未来充满信心。',
        '文章指出的问题确实存在，希望能尽快解决。',
        '内容很实用，对我的工作有很大帮助。',
        '观点新颖，角度独特，引人思考。',
        '这是我看过的对这个问题最全面的分析。',
        '文章有理有据，令人信服。',
        '作为行业内人士，对文章的观点表示认同。',
        '希望相关部门能重视文章提出的建议。',
        '分析得很透彻，对我理解政策有很大帮助。',
        '这样的优质内容应该让更多人看到。',
        '文章数据翔实，分析客观，很有参考价值。',
        '期待后续能有更深入的报道。',
        '作者的专业水平很高，期待更多作品。',
        '这个话题很有现实意义，文章分析得很好。'
    ]

    const replyComments = [
        '确实如此，我也有同样的感受。',
        '你说得对，这个问题值得深入探讨。',
        '非常赞同你的观点！',
        '我也注意到了这个问题，希望能引起重视。',
        '说得好，支持你的看法。',
        '有道理，你的分析很到位。',
        '同感，这确实是个值得关注的问题。',
        '你提出的观点很有启发性。',
        '完全同意，这个角度很重要。',
        '谢谢分享你的见解，很有参考价值。'
    ]

    const comments = []
    for (let i = 0; i < 30; i++) {
        const articleIndex = Math.floor(Math.random() * articles.length)
        const users = [user1, user2]
        const userIndex = i % users.length

        const comment = await prisma.comment.create({
            data: {
                articleId: articles[articleIndex].id,
                userId: users[userIndex].id,
                content: realComments[i],
                status: 'APPROVED'
            }
        })

        comments.push(comment)

        // 创建一些回复
        if (i % 5 === 0 && i > 0) {
            const replyIndex = Math.floor(Math.random() * replyComments.length)
            await prisma.comment.create({
                data: {
                    articleId: articles[articleIndex].id,
                    userId: users[(userIndex + 1) % users.length].id,
                    content: replyComments[replyIndex],
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
