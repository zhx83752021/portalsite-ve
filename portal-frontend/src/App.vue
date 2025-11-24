<script setup lang="ts">
import { onMounted, onBeforeUnmount, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { useAppStore } from '@/stores/app'
import Header from '@/components/layout/Header.vue'
import Footer from '@/components/layout/Footer.vue'

const route = useRoute()
const userStore = useUserStore()
const appStore = useAppStore()

// 判断是否为后台管理页面
const isAdminPage = computed(() => {
  return route.path.startsWith('/admin')
})

// 初始化用户信息
onMounted(() => {
  userStore.initUserInfo()
  appStore.checkDevice()
  window.addEventListener('resize', appStore.checkDevice)
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', appStore.checkDevice)
})
</script>

<template>
  <div id="app">
    <Header v-if="!isAdminPage" />
    <main class="main-content" :class="{ 'admin-content': isAdminPage }">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
    <Footer v-if="!isAdminPage" />
  </div>
</template>

<style>
#app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding: 20px 0;
  background: #f5f5f5;
}

/* 后台管理页面不需要padding和背景色 */
.main-content.admin-content {
  padding: 0;
  background: transparent;
}

@media (max-width: 768px) {
  .main-content {
    padding: 10px 0;
  }

  .main-content.admin-content {
    padding: 0;
  }
}
</style>
