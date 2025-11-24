<template>
  <div class="user-page">
    <div class="container">
      <el-row :gutter="20">
        <el-col :xs="24" :sm="6">
          <el-card class="user-card">
            <div class="user-info">
              <el-avatar :size="80" :src="userInfo?.avatar">
                {{ userInfo?.username?.charAt(0) }}
              </el-avatar>
              <h3>{{ userInfo?.username }}</h3>
              <p>{{ userInfo?.email }}</p>
            </div>
          </el-card>
        </el-col>

        <el-col :xs="24" :sm="18">
          <el-card>
            <el-tabs v-model="activeTab">
              <el-tab-pane label="个人资料" name="profile">
                <el-form :model="profileForm" label-width="100px">
                  <el-form-item label="用户名">
                    <el-input v-model="profileForm.username" />
                  </el-form-item>
                  <el-form-item label="邮箱">
                    <el-input v-model="profileForm.email" disabled />
                  </el-form-item>
                  <el-form-item>
                    <el-button type="primary" @click="updateProfile">保存</el-button>
                  </el-form-item>
                </el-form>
              </el-tab-pane>

              <el-tab-pane label="我的收藏" name="favorites">
                <div class="favorites-list">
                  <el-empty v-if="favorites.length === 0" description="暂无收藏" />
                  <div v-for="item in favorites" :key="item.id" class="favorite-item" @click="goToDetail(item.id)">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.summary }}</p>
                  </div>
                </div>
              </el-tab-pane>

              <el-tab-pane label="浏览历史" name="history">
                <div class="history-list">
                  <el-empty v-if="history.length === 0" description="暂无浏览记录" />
                  <div v-for="item in history" :key="item.id" class="history-item" @click="goToDetail(item.id)">
                    <h4>{{ item.title }}</h4>
                    <p>{{ item.time }}</p>
                  </div>
                </div>
              </el-tab-pane>
            </el-tabs>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { ElMessage } from 'element-plus'

const router = useRouter()
const userStore = useUserStore()

const activeTab = ref('profile')
const favorites = ref<any[]>([])
const history = ref<any[]>([])

const userInfo = computed(() => userStore.userInfo)

const profileForm = reactive({
  username: '',
  email: ''
})

const updateProfile = () => {
  userStore.updateUserInfo({
    username: profileForm.username
  })
  ElMessage.success('保存成功')
}

const goToDetail = (id: number) => {
  router.push(`/news/${id}`)
}

onMounted(() => {
  if (userInfo.value) {
    profileForm.username = userInfo.value.username
    profileForm.email = userInfo.value.email
  }

  // 模拟数据
  favorites.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 1,
    title: `收藏的文章 ${i + 1}`,
    summary: '文章摘要...'
  }))

  history.value = Array.from({ length: 5 }, (_, i) => ({
    id: i + 10,
    title: `浏览过的文章 ${i + 1}`,
    time: new Date(Date.now() - i * 3600000).toLocaleString()
  }))
})
</script>

<style scoped lang="css">
.user-page {
  min-height: 60vh;
}

.user-card {
  margin-bottom: 20px;
}

.user-info {
  text-align: center;
  padding: 20px;
}

.user-info h3 {
  margin: 15px 0 5px;
  font-size: 20px;
}

.user-info p {
  color: #909399;
  font-size: 14px;
}

.favorites-list,
.history-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.favorite-item,
.history-item {
  padding: 15px;
  background: #f5f7fa;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;
}

.favorite-item:hover,
.history-item:hover {
  background: #e4e7ed;
}

.favorite-item h4,
.history-item h4 {
  margin: 0 0 8px;
  font-size: 16px;
  color: #303133;
}

.favorite-item p,
.history-item p {
  margin: 0;
  font-size: 14px;
  color: #606266;
}
</style>
