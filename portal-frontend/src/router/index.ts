import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'Home',
        component: () => import('@/views/Home/index.vue'),
        meta: { title: '首页' }
    },
    {
        path: '/news',
        name: 'News',
        component: () => import('@/views/News/index.vue'),
        meta: { title: '新闻' }
    },
    {
        path: '/news/:id',
        name: 'NewsDetail',
        component: () => import('@/views/News/Detail.vue'),
        meta: { title: '新闻详情' }
    },
    {
        path: '/finance',
        name: 'Finance',
        component: () => import('@/views/Finance/index.vue'),
        meta: { title: '财经' }
    },
    {
        path: '/sports',
        name: 'Sports',
        component: () => import('@/views/Sports/index.vue'),
        meta: { title: '体育' }
    },
    {
        path: '/entertainment',
        name: 'Entertainment',
        component: () => import('@/views/Entertainment/index.vue'),
        meta: { title: '娱乐' }
    },
    {
        path: '/tech',
        name: 'Tech',
        component: () => import('@/views/Tech/index.vue'),
        meta: { title: '科技' }
    },
    {
        path: '/user',
        name: 'User',
        component: () => import('@/views/User/index.vue'),
        meta: { title: '用户中心', requiresAuth: true }
    },
    {
        path: '/login',
        name: 'Login',
        component: () => import('@/views/User/Login.vue'),
        meta: { title: '登录' }
    },
    {
        path: '/register',
        name: 'Register',
        component: () => import('@/views/User/Register.vue'),
        meta: { title: '注册' }
    },
    {
        path: '/admin/login',
        name: 'AdminLogin',
        component: () => import('@/views/Admin/Login.vue'),
        meta: { title: '后台登录' }
    },
    {
        path: '/admin',
        component: () => import('@/views/Admin/index.vue'),
        meta: { title: '后台管理', requiresAdmin: true },
        children: [
            {
                path: '',
                name: 'AdminDashboard',
                component: () => import('@/views/Admin/Dashboard.vue'),
                meta: { title: '控制台', requiresAdmin: true }
            },
            {
                path: 'articles',
                name: 'AdminArticles',
                component: () => import('@/views/Admin/Articles.vue'),
                meta: { title: '文章管理', requiresAdmin: true }
            },
            {
                path: 'categories',
                name: 'AdminCategories',
                component: () => import('@/views/Admin/Categories.vue'),
                meta: { title: '分类管理', requiresAdmin: true }
            },
            {
                path: 'users',
                name: 'AdminUsers',
                component: () => import('@/views/Admin/Users.vue'),
                meta: { title: '用户管理', requiresAdmin: true }
            },
            {
                path: 'comments',
                name: 'AdminComments',
                component: () => import('@/views/Admin/Comments.vue'),
                meta: { title: '评论管理', requiresAdmin: true }
            },
            {
                path: 'settings',
                name: 'AdminSettings',
                component: () => import('@/views/Admin/Settings.vue'),
                meta: { title: '系统设置', requiresAdmin: true }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('@/views/NotFound.vue'),
        meta: { title: '404' }
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        } else {
            return { top: 0 }
        }
    }
})

// 路由守卫
router.beforeEach((to, from, next) => {
    // 设置页面标题
    const baseTitle = to.path.startsWith('/admin') ? '后台管理系统' : '门户网站'
    document.title = `${to.meta.title as string} - ${baseTitle}`

    // 检查是否需要管理员权限
    if (to.meta.requiresAdmin) {
        const adminToken = localStorage.getItem('admin_token')
        if (!adminToken) {
            next({
                path: '/admin/login',
                query: { redirect: to.fullPath }
            })
            return
        }
    }

    // 检查是否需要用户登录
    if (to.meta.requiresAuth) {
        const token = localStorage.getItem('token')
        if (!token) {
            next({
                path: '/login',
                query: { redirect: to.fullPath }
            })
            return
        }
    }

    next()
})

export default router
