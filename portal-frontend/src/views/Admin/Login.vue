<template>
  <div class="admin-login-page">
    <div class="bg-decoration" aria-hidden="true"></div>
    <div class="login-container">
      <el-card class="login-card">
        <div class="login-title">
          <div class="seal-mark">新</div>
          <h2>内容控制台</h2>
          <p class="subtitle">CONTENT&nbsp;CONSOLE&nbsp;·&nbsp;管理员入口</p>
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
      ElMessage.error(error.message || '登录失败')
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
  background: linear-gradient(135deg, var(--brand-navy-900) 0%, var(--brand-navy) 100%);
  position: relative;
  overflow: hidden;
}

.admin-login-page::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--brand-red);
  z-index: 2;
}

.bg-decoration {
  position: absolute;
  inset: 0;
  background-image:
    radial-gradient(circle at 20% 30%, rgba(212, 175, 55, 0.08) 0%, transparent 40%),
    radial-gradient(circle at 80% 70%, rgba(197, 32, 44, 0.1) 0%, transparent 45%);
  pointer-events: none;
}

.login-container {
  width: 100%;
  max-width: 440px;
  padding: 20px;
  position: relative;
  z-index: 1;
}

.login-card {
  box-shadow: 0 18px 60px rgba(6, 26, 51, 0.45);
  border-radius: var(--radius-md);
  padding: 24px 16px 16px;
  border: none;
  background: #fff;
}

.login-title {
  text-align: center;
  margin-bottom: 28px;
}

.login-title .seal-mark {
  width: 56px;
  height: 56px;
  margin: 0 auto 16px;
  background: var(--brand-red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: var(--fw-bold);
  font-size: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  box-shadow: 0 4px 14px rgba(197, 32, 44, 0.3);
}

.login-title h2 {
  margin: 0;
  font-size: 24px;
  font-weight: var(--fw-bold);
  color: var(--ink-900);
  font-family: var(--font-display);
  letter-spacing: 0.02em;
}

.login-title .subtitle {
  margin: 6px 0 0;
  font-size: var(--fs-micro);
  letter-spacing: 0.18em;
  color: var(--ink-500);
  font-family: var(--font-en);
  text-transform: uppercase;
}

.login-tip {
  margin-top: 20px;
}

.login-tip :deep(.el-alert) {
  background-color: var(--mist-50);
  border: 1px solid var(--line-200);
}

.login-tip :deep(.el-alert__content) p {
  margin: 4px 0;
  font-size: 13px;
  color: var(--ink-700);
}
</style>
