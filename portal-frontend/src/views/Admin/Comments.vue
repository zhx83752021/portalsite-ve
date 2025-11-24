<template>
  <div class="admin-comments">
    <h1 class="page-title">评论管理</h1>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>评论列表</span>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="关键词">
          <el-input v-model="searchForm.keyword" placeholder="请输入评论内容" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
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
            搜索
          </el-button>
          <el-button @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>

      <!-- 评论列表 -->
      <el-table :data="commentList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="content" label="评论内容" min-width="300" />
        <el-table-column prop="username" label="用户" width="120" />
        <el-table-column prop="articleTitle" label="所属文章" min-width="200" show-overflow-tooltip />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 0 ? 'warning' : 'info'">
              {{ row.status === 1 ? '已通过' : row.status === 0 ? '待审核' : '已拒绝' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="评论时间" width="180" />
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

      <!-- 分页 -->
      <div class="pagination">
        <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
          :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
          @size-change="handleSizeChange" @current-change="handlePageChange" />
      </div>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Search, Select, Close, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'

const loading = ref(false)

// 搜索表单
const searchForm = reactive({
  keyword: '',
  status: ''
})

// 评论列表
const commentList = ref([
  {
    id: 1,
    content: '这篇文章写得非常好，受益匹浅！感谢作者的分享。',
    username: '张三',
    articleTitle: '门户网站产品需求文档发布',
    status: 1,
    createdAt: '2024-11-24 14:30'
  },
  {
    id: 2,
    content: '内容很精彩，期待更多优质文章！',
    username: '李四',
    articleTitle: 'Vue 3 最佳实践指南',
    status: 0,
    createdAt: '2024-11-24 15:15'
  },
  {
    id: 3,
    content: '不错的文章，分析很透彻。',
    username: '王五',
    articleTitle: 'TypeScript 开发技巧',
    status: 1,
    createdAt: '2024-11-24 16:00'
  },
  {
    id: 4,
    content: '这是一条测试垃圾评论内容...',
    username: '匿名用户',
    articleTitle: '门户网站产品需求文档发布',
    status: 2,
    createdAt: '2024-11-24 13:45'
  },
  {
    id: 5,
    content: '很有帮助，收藏了！',
    username: '张三',
    articleTitle: 'Vue 3 最佳实践指南',
    status: 0,
    createdAt: '2024-11-24 17:20'
  }
])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 5
})

// 加载评论列表
const loadComments = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取评论列表
    // const data = await getComments({ ...searchForm, ...pagination })
    // commentList.value = data.list
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
  loadComments()
}

// 重置
const handleReset = () => {
  searchForm.keyword = ''
  searchForm.status = ''
  pagination.page = 1
  loadComments()
}

// 通过评论
const handleApprove = (row: any) => {
  ElMessageBox.confirm(`确定要通过该评论吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'success'
  }).then(async () => {
    try {
      // TODO: 调用API审批评论
      // await approveComment(row.id)

      // 模拟通过
      const index = commentList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        const comment = commentList.value[index]
        if (comment) {
          comment.status = 1
        }
      }
      ElMessage.success('审核通过')
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 拒绝评论
const handleReject = (row: any) => {
  ElMessageBox.confirm(`确定要拒绝该评论吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API拒绝评论
      // await rejectComment(row.id)

      // 模拟拒绝
      const index = commentList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        const comment = commentList.value[index]
        if (comment) {
          comment.status = 2
        }
      }
      ElMessage.success('已拒绝')
    } catch (error: any) {
      ElMessage.error(error.message || '操作失败')
    }
  }).catch(() => {
    // 取消操作
  })
}

// 删除评论
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除该评论吗？删除后无法恢复。`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API删除评论
      // await deleteComment(row.id)

      // 模拟删除
      const index = commentList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        commentList.value.splice(index, 1)
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
