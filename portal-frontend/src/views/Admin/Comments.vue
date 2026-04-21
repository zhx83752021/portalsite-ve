<template>
  <div class="admin-comments">
    <h1 class="page-title">评论管理</h1>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>评论列表</span>
        </div>
      </template>

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 160px">
            <el-option label="全部" value="" />
            <el-option label="待审核" :value="0" />
            <el-option label="已通过" :value="1" />
            <el-option label="已拒绝" :value="2" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="handleSearch">
            <el-icon>
              <Search />
            </el-icon>
            查询
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <el-table :data="commentList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content" label="评论内容" min-width="300" />
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column label="所属文章" min-width="200" show-overflow-tooltip>
          <template #default="{ row }">
            {{ row.articleTitle || `文章 #${row.articleId}` }}
          </template>
        </el-table-column>
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 0 ? 'warning' : 'info'">
              {{ row.status === 1 ? '已通过' : row.status === 0 ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="评论时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="250" fixed="right">
          <template #default="{ row }">
            <el-button size="small" type="success" @click="handleApprove(row)" v-if="row.status !== 1">
              <el-icon><Select /></el-icon>
              通过
            </el-button>
            <el-button size="small" type="warning" @click="handleReject(row)" v-if="row.status !== 2">
              <el-icon>
                <Close />
              </el-icon>
              拒绝
            </el-button>
            <el-button size="small" type="danger" @click="handleDelete(row)">
              <el-icon>
                <Delete />
              </el-icon>
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="pagination">
        <el-pagination
          v-model:current-page="pagination.page"
          v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]"
          :total="pagination.total"
          layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange"
          @current-change="handlePageChange"
        />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Select, Close, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  getAdminComments,
  patchAdminComment,
  deleteAdminComment,
  type AdminComment,
} from '@/api/admin'

const loading = ref(false)

const searchForm = reactive({
  status: '' as number | '',
})

const commentList = ref<AdminComment[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const formatTime = (t: string) => {
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return t
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const loadComments = async () => {
  loading.value = true
  try {
    const statusParam =
      searchForm.status === '' || searchForm.status === undefined
        ? undefined
        : searchForm.status === 0
          ? 'pending'
          : searchForm.status === 1
            ? 'approved'
            : 'rejected'

    const data = await getAdminComments({
      page: pagination.page,
      pageSize: pagination.pageSize,
      status: statusParam,
    })
    commentList.value = data.list || []
    pagination.total = data.total
  } catch (e: any) {
    ElMessage.error(e?.message || '加载失败')
    commentList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadComments()
}

const handleReset = () => {
  searchForm.status = ''
  pagination.page = 1
  loadComments()
}

const handleApprove = (row: AdminComment) => {
  ElMessageBox.confirm(`确定要通过该评论吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success',
  })
    .then(async () => {
      await patchAdminComment(row.id, 1)
      ElMessage.success('审核通过')
      await loadComments()
    })
    .catch(() => {})
}

const handleReject = (row: AdminComment) => {
  ElMessageBox.confirm(`确定要拒绝该评论吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await patchAdminComment(row.id, 2)
      ElMessage.success('已拒绝')
      await loadComments()
    })
    .catch(() => {})
}

const handleDelete = (row: AdminComment) => {
  ElMessageBox.confirm(`确定要删除该评论吗？删除后无法恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deleteAdminComment(row.id)
      ElMessage.success('删除成功')
      await loadComments()
    })
    .catch(() => {})
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadComments()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadComments()
}

onMounted(() => {
  loadComments()
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
