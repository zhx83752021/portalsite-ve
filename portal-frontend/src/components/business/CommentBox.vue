<template>
    <div class="comment-box">
        <div class="comment-header">
            <h3>
                <el-icon>
                    <ChatDotRound />
                </el-icon>
                评论 ({{ total }})
            </h3>
        </div>

        <!-- 评论输入框 -->
        <div class="comment-input" v-if="isLoggedIn">
            <el-avatar :src="userAvatar" :size="40">
                {{ username?.charAt(0) }}
            </el-avatar>
            <div class="input-area">
                <el-input v-model="commentText" type="textarea" :rows="3" placeholder="发表你的看法..." maxlength="500"
                    show-word-limit />
                <div class="input-actions">
                    <el-button @click="commentText = ''" size="small">取消</el-button>
                    <el-button type="primary" @click="submitComment" size="small" :loading="submitting">
                        发表评论
                    </el-button>
                </div>
            </div>
        </div>

        <!-- 未登录提示 -->
        <div class="login-tip" v-else>
            <el-alert title="登录后才能发表评论" type="info" :closable="false" center>
                <template #default>
                    <el-button type="primary" size="small" @click="goToLogin">立即登录</el-button>
                </template>
            </el-alert>
        </div>

        <!-- 评论列表 -->
        <div class="comment-list">
            <div v-for="comment in comments" :key="comment.id" class="comment-item">
                <el-avatar :src="comment.userAvatar" :size="40">
                    {{ comment.username?.charAt(0) }}
                </el-avatar>
                <div class="comment-content">
                    <div class="comment-meta">
                        <span class="username">{{ comment.username }}</span>
                        <span class="time">{{ formatTime(comment.createdAt) }}</span>
                    </div>
                    <div class="comment-text">{{ comment.content }}</div>
                    <div class="comment-actions">
                        <el-button text size="small" @click="likeComment(comment.id)"
                            :class="{ 'liked': comment.isLiked }">
                            <el-icon>
                                <Star />
                            </el-icon>
                            赞 {{ comment.likes > 0 ? comment.likes : '' }}
                        </el-button>
                        <el-button text size="small" @click="replyComment(comment.id)">
                            <el-icon>
                                <ChatDotRound />
                            </el-icon>
                            回复
                        </el-button>
                    </div>

                    <!-- 回复列表 -->
                    <div v-if="comment.replies && comment.replies.length > 0" class="reply-list">
                        <div v-for="reply in comment.replies" :key="reply.id" class="reply-item">
                            <el-avatar :src="reply.userAvatar" :size="32">
                                {{ reply.username?.charAt(0) }}
                            </el-avatar>
                            <div class="reply-content">
                                <div class="reply-meta">
                                    <span class="username">{{ reply.username }}</span>
                                    <span class="time">{{ formatTime(reply.createdAt) }}</span>
                                </div>
                                <div class="reply-text">{{ reply.content }}</div>
                            </div>
                        </div>
                    </div>

                    <!-- 回复输入框 -->
                    <div v-if="replyingTo === comment.id" class="reply-input">
                        <el-input v-model="replyText" type="textarea" :rows="2" :placeholder="`回复 @${comment.username}`"
                            maxlength="500" />
                        <div class="reply-actions">
                            <el-button @click="cancelReply" size="small">取消</el-button>
                            <el-button type="primary" @click="submitReply(comment.id)" size="small">
                                发送
                            </el-button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- 加载更多 -->
            <div class="load-more" v-if="hasMore">
                <el-button @click="loadMore" :loading="loading">加载更多评论</el-button>
            </div>

            <!-- 空状态 -->
            <el-empty v-if="comments.length === 0" description="暂无评论，快来抢沙发吧！" />
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ChatDotRound, Star } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'

interface Comment {
    id: number
    username: string
    userAvatar?: string
    content: string
    likes: number
    createdAt: string
    isLiked?: boolean
    replies?: Comment[]
}

interface Props {
    articleId: number
}

const props = defineProps<Props>()

const router = useRouter()
const userStore = useUserStore()

const comments = ref<Comment[]>([])
const total = ref(0)
const commentText = ref('')
const replyText = ref('')
const replyingTo = ref<number | null>(null)
const submitting = ref(false)
const loading = ref(false)
const hasMore = ref(true)
const page = ref(1)
const pageSize = 20

const isLoggedIn = computed(() => userStore.isLoggedIn)
const username = computed(() => userStore.userInfo?.username)
const userAvatar = computed(() => userStore.userInfo?.avatar)

const fetchComments = async () => {
    loading.value = true
    try {
        // 这里应该调用API获取评论
        // const response = await getComments(props.articleId, page.value, pageSize)
        // 模拟数据
        await new Promise(resolve => setTimeout(resolve, 500))
        const mockComments: Comment[] = Array.from({ length: 5 }, (_, i) => ({
            id: i + 1,
            username: `用户${i + 1}`,
            userAvatar: undefined,
            content: `这是第${i + 1}条评论内容，非常精彩的文章，受益匪浅！`,
            likes: Math.floor(Math.random() * 100),
            createdAt: new Date(Date.now() - Math.random() * 86400000 * 7).toISOString(),
            isLiked: false,
            replies: i === 0 ? [
                {
                    id: 100,
                    username: '回复者',
                    content: '非常同意你的观点！',
                    likes: 5,
                    createdAt: new Date().toISOString()
                }
            ] : []
        }))

        if (page.value === 1) {
            comments.value = mockComments
        } else {
            comments.value.push(...mockComments)
        }

        total.value = mockComments.length
        hasMore.value = mockComments.length >= pageSize
    } catch (error) {
        ElMessage.error('获取评论失败')
    } finally {
        loading.value = false
    }
}

const submitComment = async () => {
    if (!commentText.value.trim()) {
        ElMessage.warning('请输入评论内容')
        return
    }

    submitting.value = true
    try {
        // 这里应该调用API提交评论
        // await createComment({ articleId: props.articleId, content: commentText.value })

        await new Promise(resolve => setTimeout(resolve, 500))

        // 模拟添加评论
        const newComment: Comment = {
            id: Date.now(),
            username: username.value || '当前用户',
            userAvatar: userAvatar.value,
            content: commentText.value,
            likes: 0,
            createdAt: new Date().toISOString(),
            isLiked: false,
            replies: []
        }

        comments.value.unshift(newComment)
        total.value++
        commentText.value = ''
        ElMessage.success('评论发表成功')
    } catch (error) {
        ElMessage.error('评论发表失败')
    } finally {
        submitting.value = false
    }
}

const replyComment = (commentId: number) => {
    if (!isLoggedIn.value) {
        goToLogin()
        return
    }
    replyingTo.value = commentId
}

const cancelReply = () => {
    replyingTo.value = null
    replyText.value = ''
}

const submitReply = async (commentId: number) => {
    if (!replyText.value.trim()) {
        ElMessage.warning('请输入回复内容')
        return
    }

    try {
        // 这里应该调用API提交回复
        await new Promise(resolve => setTimeout(resolve, 500))

        // 模拟添加回复
        const comment = comments.value.find(c => c.id === commentId)
        if (comment) {
            if (!comment.replies) comment.replies = []
            comment.replies.push({
                id: Date.now(),
                username: username.value || '当前用户',
                userAvatar: userAvatar.value,
                content: replyText.value,
                likes: 0,
                createdAt: new Date().toISOString()
            })
        }

        replyText.value = ''
        replyingTo.value = null
        ElMessage.success('回复成功')
    } catch (error) {
        ElMessage.error('回复失败')
    }
}

const likeComment = async (commentId: number) => {
    if (!isLoggedIn.value) {
        goToLogin()
        return
    }

    const comment = comments.value.find(c => c.id === commentId)
    if (comment) {
        comment.isLiked = !comment.isLiked
        comment.likes += comment.isLiked ? 1 : -1
    }
}

const loadMore = () => {
    page.value++
    fetchComments()
}

const formatTime = (time: string) => {
    const date = new Date(time)
    const now = new Date()
    const diff = now.getTime() - date.getTime()

    if (diff < 3600000) {
        return Math.floor(diff / 60000) + '分钟前'
    } else if (diff < 86400000) {
        return Math.floor(diff / 3600000) + '小时前'
    } else if (diff < 604800000) {
        return Math.floor(diff / 86400000) + '天前'
    } else {
        return date.toLocaleDateString()
    }
}

const goToLogin = () => {
    router.push('/login')
}

onMounted(() => {
    fetchComments()
})
</script>

<style scoped lang="css">
.comment-box {
    background: #fff;
    border-radius: 8px;
    padding: 24px;
    margin-top: 30px;
}

.comment-header {
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 1px solid #e8e8e8;
}

.comment-header h3 {
    font-size: 20px;
    color: #303133;
    margin: 0;
    display: flex;
    align-items: center;
    gap: 8px;
}

.comment-input {
    display: flex;
    gap: 12px;
    margin-bottom: 24px;
    padding-bottom: 24px;
    border-bottom: 1px solid #f0f0f0;
}

.input-area {
    flex: 1;
}

.input-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 12px;
}

.login-tip {
    margin-bottom: 24px;
}

.comment-list {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.comment-item {
    display: flex;
    gap: 12px;
    padding: 16px;
    background: #fafafa;
    border-radius: 8px;
    transition: background 0.3s;
}

.comment-item:hover {
    background: #f5f5f5;
}

.comment-content {
    flex: 1;
}

.comment-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 8px;
}

.username {
    font-weight: 600;
    color: #303133;
    font-size: 14px;
}

.time {
    font-size: 12px;
    color: #909399;
}

.comment-text {
    font-size: 14px;
    color: #606266;
    line-height: 1.6;
    margin-bottom: 12px;
    word-break: break-word;
}

.comment-actions {
    display: flex;
    gap: 16px;
}

.comment-actions .el-button {
    color: #909399;
}

.comment-actions .el-button.liked {
    color: #f56c6c;
}

.comment-actions .el-button:hover {
    color: #409EFF;
}

.reply-list {
    margin-top: 16px;
    padding-left: 12px;
    border-left: 2px solid #e8e8e8;
}

.reply-item {
    display: flex;
    gap: 10px;
    padding: 12px;
    background: #fff;
    border-radius: 6px;
    margin-bottom: 12px;
}

.reply-item:last-child {
    margin-bottom: 0;
}

.reply-content {
    flex: 1;
}

.reply-meta {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 6px;
}

.reply-text {
    font-size: 13px;
    color: #606266;
    line-height: 1.6;
}

.reply-input {
    margin-top: 16px;
    padding-top: 16px;
    border-top: 1px solid #e8e8e8;
}

.reply-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 12px;
}

.load-more {
    text-align: center;
    margin-top: 24px;
}

@media (max-width: 768px) {
    .comment-box {
        padding: 16px;
    }

    .comment-input,
    .comment-item {
        gap: 10px;
    }

    .comment-meta {
        flex-direction: column;
        align-items: flex-start;
        gap: 4px;
    }
}
</style>
