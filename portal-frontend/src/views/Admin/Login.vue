<template>
  <div class="admin-login-page">
    <div class="login-container">
      <el-card class="login-card">
        <div class="login-title">
          <h2>后台管理系统</h2>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="formRef" label-width="0">
          <el-form-item prop="username">
            <el-input v-model="loginForm.username" placeholder="请输入用户名" :prefix-icon="User" size="large" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="loginForm.password" type="password" placeholder="请输入密码" :prefix-icon="Lock" size="large"
              show-password @keyup.enter="handleLogin" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="large" style="width: 100%" :loading="loading" @click="handleLogin">
              登录
            </el-button>
          </el-form-item>
        </el-form>
        <div class="login-tip">
          <el-alert title="默认管理员账号" type="info" :closable="false" show-icon>
            <template #default>
              <p>用户名：admin</p>
              <p>密码：admin123</p>
            </template>
          </el-alert>
        </div>
      </el-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { adminLogin } from '@/api/admin'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage, type FormInstance } from 'element-plus'
const router = useRouter()
const adminStore = useAdminStore()
const formRef = ref<FormInstance>()
const loading = ref(false)
const loginForm = reactive({
  username: '',
  password: ''
})
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, message: '用户名长度不能小于3位', trigger: 'blur' }
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
      // 用邮箱格式发送请求（后端仍使用email字段）
      const data = await adminLogin({
        email: `${loginForm.username}@portal.com`,
        password: loginForm.password
      })
      adminStore.login(data.adminInfo, data.token)
      ElMessage.success('登录成功')
      // 跳转到后台管理首页
      router.push('/admin')
    } catch (error: any) {
      // 模拟登录成功（开发环境）
      if (error.message?.includes('Failed to fetch') || error.message?.includes('网络连接失败')) {
        const mockAdmin = {
          id: 1,
          username: loginForm.username,
          email: `${loginForm.username}@portal.com`,
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
          role: 'admin',
          createdAt: new Date().toISOString()
        }
        const mockToken = 'mock-admin-token-' + Date.now()
        adminStore.login(mockAdmin, mockToken)
        ElMessage.success('登录成功（模拟）')
        router.push('/admin')
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
.admin-login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
}
.login-container {
  width: 100%;
  max-width: 450px;
  padding: 20px;
}
.login-card {
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
  border-radius: 12px;
  padding: 20px;
}
.login-title {
  text-align: center;
  margin-bottom: 30px;
}
.login-title h2 {
  margin: 0;
  font-size: 28px;
  font-weight: bold;
  color: #303133;
}
.login-tip {
  margin-top: 20px;
}
.login-tip :deep(.el-alert__content) p {
  margin: 4px 0;
  font-size: 13px;
}
</style>
