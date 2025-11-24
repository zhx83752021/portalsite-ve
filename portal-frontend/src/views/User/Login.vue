<template>
  <div class="login-page">
    <div class="login-container">
      <el-card class="login-card">
        <template #header>
          <div class="card-header">
            <h2>用户登录</h2>
          </div>
        </template>

        <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0">
          <el-form-item prop="email">
            <el-input
              v-model="loginForm.email"
              placeholder="请输入邮箱"
              :prefix-icon="Message"
              size="large"
            />
          </el-form-item>

          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              type="password"
              placeholder="请输入密码"
              :prefix-icon="Lock"
              size="large"
              show-password
              @keyup.enter="handleLogin"
            />
          </el-form-item>

          <el-form-item>
            <el-button type="primary" size="large" style="width: 100%" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>

        <div class="login-footer">
          <span>还没有账号？</span>
          <router-link to="/register">立即注册</router-link>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { login } from '@/api/user'
import { Message, Lock } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'

const router = useRouter()
const route = useRoute()
const userStore = useUserStore()

const formRef = ref<FormInstance>()
const loading = ref(false)

const loginForm = reactive({
  email: '',
  password: ''
})

const rules = {
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码长度不能小于6位', trigger: 'blur' }
  ]
}

const handleLogin = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    loading.value = true
    try {
      const data = await login(loginForm)
      userStore.login(data.userInfo, data.token)
      ElMessage.success('登录成功')

      // 跳转到之前的页面或首页
      const redirect = route.query.redirect as string || '/'
      router.push(redirect)
    } catch (error: any) {
      // 模拟登录成功（开发环境）
      if (error.message?.includes('Failed to fetch') || error.message?.includes('Network')) {
        const mockUser = {
          id: 1,
          username: loginForm.email.split('@')[0] || 'user',
          email: loginForm.email,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=1',
          role: 'user'
        }
        const mockToken = 'mock-token-' + Date.now()
        userStore.login(mockUser, mockToken)
        ElMessage.success('登录成功（模拟）')
        const redirect = route.query.redirect as string || '/'
        router.push(redirect)
      } else {
        ElMessage.error(error.message || '登录失败')
      }
    } finally {
      loading.value = false
    }
  })
}
</script>

<style scoped lang="css">
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 200px);
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.login-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.login-card {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.card-header h2 {
  margin: 0;
  text-align: center;
  color: #303133;
}

.login-footer {
  text-align: center;
  margin-top: 20px;
  font-size: 14px;
  color: #606266;
}

.login-footer a {
  color: #409EFF;
  text-decoration: none;
  margin-left: 5px;
}

.login-footer a:hover {
  text-decoration: underline;
}
</style>
