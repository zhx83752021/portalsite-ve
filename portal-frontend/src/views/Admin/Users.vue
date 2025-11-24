<template>
  <div class="admin-users">
    <h1 class="page-title">用户管理</h1>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>用户列表</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="用户名">
          <el-input v-model="searchForm.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="searchForm.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="正常" :value="1" />
            <el-option label="禁用" :value="0" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 用户列表 -->
      <el-table :data="userList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="username" label="用户名" min-width="120" />
        <el-table-column prop="email" label="邮箱" min-width="180" />
        <el-table-column prop="role" label="角色" width="100">
          <template #default="{ row }">
            <el-tag :type="row.role === 'ADMIN' ? 'danger' : 'primary'">
              {{ row.role === 'ADMIN' ? '管理员' : '普通用户' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : 'info'">
              {{ row.status === 1 ? '正常' : '禁用' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="注册时间" width="180" />
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
            </el-button>
            <el-button size="small" :type="row.status === 1 ? 'warning' : 'success'" @click="handleToggleStatus(row)">
              <el-icon>
                <Lock />
              </el-icon>
              {{ row.status === 1 ? '禁用' : '启用' }}
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)" v-if="row.role !== 'ADMIN'">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 分页 -->
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handlePageChange" class="pagination" />
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="userForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="userForm.username" placeholder="请输入用户名" :disabled="!!userForm.id" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="userForm.email" placeholder="请输入邮箱" :disabled="!!userForm.id" />
        </el-form-item>
        <el-form-item label="角色" prop="role">
          <el-radio-group v-model="userForm.role">
            <el-radio value="USER">普通用户</el-radio>
            <el-radio value="ADMIN">管理员</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="userForm.status">
            <el-radio :value="1">正常</el-radio>
            <el-radio :value="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="handleSave" :loading="saveLoading">
          保存
        </el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Edit, Lock, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const loading = ref(false)
const saveLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('编辑用户')
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  username: '',
  email: '',
  status: ''
})

// 用户列表
const userList = ref([
  {
    id: 1,
    username: 'admin',
    email: 'admin@portal.com',
    role: 'ADMIN',
    status: 1,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 2,
    username: '张三',
    email: 'zhangsan@example.com',
    role: 'USER',
    status: 1,
    createdAt: '2024-11-24 10:30'
  },
  {
    id: 3,
    username: '李四',
    email: 'lisi@example.com',
    role: 'USER',
    status: 1,
    createdAt: '2024-11-24 11:00'
  },
  {
    id: 4,
    username: '王五',
    email: 'wangwu@example.com',
    role: 'USER',
    status: 0,
    createdAt: '2024-11-23 15:20'
  }
])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 4
})

// 用户表单
const userForm = reactive({
  id: 0,
  username: '',
  email: '',
  role: 'USER',
  status: 1
})

// 表单验证规则
const rules = {
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' }
  ],
  email: [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入有效的邮箱地址', trigger: 'blur' }
  ],
  role: [
    { required: true, message: '请选择角色', trigger: 'change' }
  ]
}

// 加载用户列表
const loadUsers = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取用户列表
    // const data = await getUsers({ ...searchForm, ...pagination })
    // userList.value = data.list
    // pagination.total = data.total

    // 模拟加载
    setTimeout(() => {
      loading.value = false
    }, 300)
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadUsers()
}

// 重置
const handleReset = () => {
  searchForm.username = ''
  searchForm.email = ''
  searchForm.status = ''
  pagination.page = 1
  loadUsers()
}

// 编辑用户
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑用户'
  userForm.id = row.id
  userForm.username = row.username
  userForm.email = row.email
  userForm.role = row.role
  userForm.status = row.status
  dialogVisible.value = true
}

// 保存用户
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saveLoading.value = true
    try {
      // TODO: 调用API保存用户
      // await updateUser(userForm.id, userForm)

      // 模拟保存
      setTimeout(() => {
        const index = userList.value.findIndex(item => item.id === userForm.id)
        if (index > -1) {
          userList.value[index] = {
            ...userList.value[index],
            ...userForm
          }
        }

        ElMessage.success('保存成功')
        dialogVisible.value = false
        saveLoading.value = false
      }, 500)
    } catch (error: any) {
      ElMessage.error(error.message || '保存失败')
      saveLoading.value = false
    }
  })
}

// 切换用户状态
const handleToggleStatus = (row: any) => {
  const action = row.status === 1 ? '禁用' : '启用'
  ElMessageBox.confirm(`确定要${action}用户「${row.username}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API切换状态
      // await toggleUserStatus(row.id)

      // 模拟切换
      const index = userList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        userList.value[index].status = row.status === 1 ? 0 : 1
      }
      ElMessage.success(`${action}成功`)
    } catch (error: any) {
      ElMessage.error(error.message || `${action}失败`)
    }
  }).catch(() => {
    // 取消操作
  })
}

// 删除用户
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除用户「${row.username}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API删除用户
      // await deleteUser(row.id)

      // 模拟删除
      const index = userList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        userList.value.splice(index, 1)
        pagination.total--
      }
      ElMessage.success('删除成功')
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

// 分页相关
const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadUsers()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadUsers()
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped lang="css">
.page-title {
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: bold;
  color: #303133;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-form {
  margin-bottom: 20px;
}

.pagination {
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;
}
</style>
