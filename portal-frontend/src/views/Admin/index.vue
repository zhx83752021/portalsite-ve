<template>
  <div class="admin-layout">
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '240px'" class="admin-aside">
        <div class="logo-container">
          <div class="logo-seal" :class="{ 'is-collapsed': isCollapse }">
            <span class="seal-mark">新</span>
          </div>
          <div v-if="!isCollapse" class="logo-text">
            <h2>中央新闻</h2>
            <span class="logo-sub">CONTENT&nbsp;CONSOLE</span>
          </div>
        </div>

        <el-menu :default-active="activeMenu" :collapse="isCollapse" :collapse-transition="false" router
          class="admin-menu">
          <el-menu-item index="/admin">
            <el-icon>
              <HomeFilled />
            </el-icon>
            <template #title>控制台</template>
          </el-menu-item>

          <el-sub-menu index="content">
            <template #title>
              <el-icon>
                <Document />
              </el-icon>
              <span>内容管理</span>
            </template>
            <el-menu-item index="/admin/articles">文章管理</el-menu-item>
            <el-menu-item index="/admin/categories">分类管理</el-menu-item>
          </el-sub-menu>

          <el-menu-item index="/admin/users">
            <el-icon>
              <User />
            </el-icon>
            <template #title>用户管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/comments">
            <el-icon>
              <ChatDotRound />
            </el-icon>
            <template #title>评论管理</template>
          </el-menu-item>

          <el-menu-item index="/admin/settings">
            <el-icon>
              <Setting />
            </el-icon>
            <template #title>系统设置</template>
          </el-menu-item>
        </el-menu>
      </el-aside>

      <el-container>
        <!-- 顶部导航栏 -->
        <el-header class="admin-header">
          <div class="header-left">
            <el-icon class="collapse-icon" @click="toggleCollapse">
              <Expand v-if="isCollapse" />
              <Fold v-else />
            </el-icon>
          </div>

          <div class="header-right">
            <el-button text @click="goToHomePage">
              <el-icon>
                <View />
              </el-icon>
              查看前台
            </el-button>

            <el-dropdown @command="handleCommand">
              <div class="admin-info">
                <el-avatar :src="adminStore.adminInfo?.avatar" />
                <span class="admin-name">{{ adminStore.adminInfo?.username }}</span>
              </div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item command="profile">
                    <el-icon>
                      <User />
                    </el-icon>
                    个人信息
                  </el-dropdown-item>
                  <el-dropdown-item command="password">
                    <el-icon>
                      <Lock />
                    </el-icon>
                    修改密码
                  </el-dropdown-item>
                  <el-dropdown-item divided command="logout">
                    <el-icon>
                      <SwitchButton />
                    </el-icon>
                    退出登录
                  </el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </el-header>

        <!-- 主内容区域 -->
        <el-main class="admin-main">
          <router-view v-slot="{ Component }">
            <transition name="fade" mode="out-in">
              <component :is="Component" />
            </transition>
          </router-view>
        </el-main>
      </el-container>
    </el-container>

    <!-- 修改密码对话框 -->
    <el-dialog v-model="passwordDialogVisible" title="修改密码" width="450px">
      <el-form :model="passwordForm" :rules="passwordRules" ref="passwordFormRef" label-width="100px">
        <el-form-item label="旧密码" prop="oldPassword">
          <el-input v-model="passwordForm.oldPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="新密码" prop="newPassword">
          <el-input v-model="passwordForm.newPassword" type="password" show-password />
        </el-form-item>
        <el-form-item label="确认密码" prop="confirmPassword">
          <el-input v-model="passwordForm.confirmPassword" type="password" show-password />
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="passwordDialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handlePasswordChange" :loading="passwordLoading">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAdminStore } from '@/stores/admin'
import { updateAdminPassword } from '@/api/admin'
import {
  Management,
  HomeFilled,
  Document,
  User,
  ChatDotRound,
  Setting,
  Expand,
  Fold,
  View,
  Lock,
  SwitchButton
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const router = useRouter()
const route = useRoute()
const adminStore = useAdminStore()

const isCollapse = ref(false)
const passwordDialogVisible = ref(false)
const passwordLoading = ref(false)
const passwordFormRef = ref<FormInstance>()

const passwordForm = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
})

const passwordRules = {
  oldPassword: [
    { required: true, message: '请输入旧密码', trigger: 'blur' }
  ],
  newPassword: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, message: '新密码长度不能小于6位', trigger: 'blur' }
  ],
  confirmPassword: [
    { required: true, message: '请确认新密码', trigger: 'blur' },
    {
      validator: (rule: any, value: any, callback: any) => {
        if (value !== passwordForm.newPassword) {
          callback(new Error('两次输入的密码不一致'))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

const activeMenu = computed(() => {
  return route.path
})

const toggleCollapse = () => {
  isCollapse.value = !isCollapse.value
}

const goToHomePage = () => {
  window.open('/', '_blank')
}

const handleCommand = (command: string) => {
  switch (command) {
    case 'profile':
      ElMessage.info('个人信息管理功能开发中')
      break
    case 'password':
      passwordDialogVisible.value = true
      break
    case 'logout':
      handleLogout()
      break
  }
}

const handlePasswordChange = async () => {
  if (!passwordFormRef.value) return

  await passwordFormRef.value.validate(async (valid) => {
    if (!valid) return

    passwordLoading.value = true
    try {
      await updateAdminPassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword
      })
      ElMessage.success('密码修改成功，请重新登录')
      passwordDialogVisible.value = false

      // 重置表单
      passwordForm.oldPassword = ''
      passwordForm.newPassword = ''
      passwordForm.confirmPassword = ''

      // 登出并跳转到登录页
      setTimeout(() => {
        handleLogout()
      }, 1000)
    } catch (error: any) {
      ElMessage.error(error.message || '密码修改失败')
    } finally {
      passwordLoading.value = false
    }
  })
}

const handleLogout = () => {
  ElMessageBox.confirm('确定要退出登录吗？', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(() => {
    adminStore.logout()
    ElMessage.success('已退出登录')
    router.push('/admin/login')
  }).catch(() => {
    // 取消操作
  })
}
</script>

<style scoped lang="css">
.admin-layout {
  height: 100vh;
  overflow: hidden;
}

.el-container {
  height: 100%;
}

/* 侧边栏样式 */
.admin-aside {
  background-color: var(--brand-navy-900);
  transition: width 0.3s;
  overflow-x: hidden;
  border-right: 1px solid rgba(255, 255, 255, 0.06);
}

.logo-container {
  display: flex;
  align-items: center;
  height: 72px;
  padding: 0 16px;
  color: #fff;
  gap: 12px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  position: relative;
}

.logo-container::after {
  content: '';
  position: absolute;
  left: 0;
  right: 0;
  bottom: -1px;
  height: 2px;
  background: var(--brand-red);
}

.logo-seal {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--brand-red);
  color: #fff;
  font-family: var(--font-display);
  font-weight: var(--fw-bold);
  font-size: 20px;
  border-radius: 4px;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(197, 32, 44, 0.35);
}

.logo-seal.is-collapsed {
  margin: 0 auto;
}

.logo-text h2 {
  margin: 0;
  font-size: 16px;
  font-weight: var(--fw-bold);
  letter-spacing: 0.05em;
  white-space: nowrap;
  font-family: var(--font-display);
  color: #fff;
}

.logo-text .logo-sub {
  display: block;
  font-size: var(--fs-micro);
  letter-spacing: 0.18em;
  color: rgba(255, 255, 255, 0.45);
  font-family: var(--font-en);
  margin-top: 2px;
}

.admin-menu {
  border: none;
  background-color: var(--brand-navy-900);
}

/* 去掉所有菜单项的边框和分隔线 */
.admin-menu :deep(.el-menu-item) {
  color: rgba(255, 255, 255, 0.7);
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  font-size: 14px;
  height: 48px;
  line-height: 48px;
}

.admin-menu :deep(.el-menu-item::before),
.admin-menu :deep(.el-menu-item::after) {
  display: none !important;
}

.admin-menu :deep(.el-menu-item:hover) {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06) !important;
  border: none !important;
}

.admin-menu :deep(.el-menu-item.is-active) {
  color: #fff;
  background-color: rgba(197, 32, 44, 0.15) !important;
  border: none !important;
  border-left: 3px solid var(--brand-red) !important;
  padding-left: calc(var(--space-5) - 3px) !important;
}

.admin-menu :deep(.el-sub-menu) {
  border: none !important;
}

.admin-menu :deep(.el-sub-menu__title) {
  color: rgba(255, 255, 255, 0.7);
  border: none !important;
  border-bottom: none !important;
  font-size: 14px;
  height: 48px;
  line-height: 48px;
}

.admin-menu :deep(.el-sub-menu__title::before),
.admin-menu :deep(.el-sub-menu__title::after) {
  display: none !important;
}

.admin-menu :deep(.el-sub-menu__title:hover) {
  color: #fff;
  background-color: rgba(255, 255, 255, 0.06) !important;
  border: none !important;
}

/* 子菜单项样式 */
.admin-menu :deep(.el-sub-menu .el-menu-item) {
  background-color: rgba(0, 0, 0, 0.22) !important;
  min-width: 0;
  border: none !important;
  border-bottom: none !important;
  border-top: none !important;
  font-size: 13px;
}

.admin-menu :deep(.el-sub-menu .el-menu-item::before),
.admin-menu :deep(.el-sub-menu .el-menu-item::after) {
  display: none !important;
}

.admin-menu :deep(.el-sub-menu .el-menu-item:hover) {
  background-color: rgba(255, 255, 255, 0.04) !important;
  border: none !important;
}

.admin-menu :deep(.el-sub-menu .el-menu-item.is-active) {
  background-color: rgba(197, 32, 44, 0.18) !important;
  color: #fff !important;
  border: none !important;
  border-left: 3px solid var(--brand-red) !important;
  padding-left: calc(var(--space-7) - 3px) !important;
}

/* 确保子菜单容器也没有边框 */
.admin-menu :deep(.el-menu) {
  border: none !important;
}

.admin-menu :deep(.el-menu--inline) {
  background-color: rgba(0, 0, 0, 0.22) !important;
}

/* 顶部导航栏样式 */
.admin-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #fff;
  border-bottom: 1px solid var(--line-200);
  padding: 0 20px;
  box-shadow: 0 1px 0 rgba(0, 0, 0, 0.02);
}

.header-left {
  display: flex;
  align-items: center;
}

.collapse-icon {
  font-size: 20px;
  cursor: pointer;
  transition: color 0.2s;
  color: var(--ink-600);
}

.collapse-icon:hover {
  color: var(--brand-navy);
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-right :deep(.el-button.is-text) {
  color: var(--ink-700);
  font-size: 13px;
}

.header-right :deep(.el-button.is-text:hover) {
  color: var(--brand-navy);
  background-color: var(--mist-50);
}

.admin-info {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  transition: background-color 0.2s;
}

.admin-info:hover {
  background-color: var(--mist-50);
}

.admin-name {
  font-size: 13px;
  color: var(--ink-800);
  font-weight: var(--fw-medium);
}

/* 主内容区域样式 */
.admin-main {
  background-color: var(--mist-50);
  padding: 24px;
  overflow-y: auto;
}

/* 页面切换动画 */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
