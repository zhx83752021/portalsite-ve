<template>
  <div class="admin-articles">
    <h1 class="page-title">文章管理</h1>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>文章列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon>
              <Plus />
            </el-icon>
            新建文章
          </el-button>
        </div>
      </template>

      <!-- 搜索栏 -->
      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入文章标题" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable>
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
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

      <!-- 文章列表 -->
      <el-table :data="articleList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column prop="category" label="分类" width="120" />
        <el-table-column prop="author" label="作者" width="120" />
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column prop="status" label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 'published' ? 'success' : 'info'">
              {{ row.status === 'published' ? '已发布' : '草稿' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="220" fixed="right">
          <template #default="{ row }">
            <el-button size="small" @click="handleEdit(row)">
              <el-icon>
                <Edit />
              </el-icon>
              编辑
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
      <el-pagination v-model:current-page="pagination.page" v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]" :total="pagination.total" layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange" @current-change="handlePageChange" class="pagination" />
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" :close-on-click-modal="false">
      <el-form :model="articleForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="分类" prop="category">
          <el-select v-model="articleForm.category" placeholder="请选择分类">
            <el-option label="新闻" value="新闻" />
            <el-option label="财经" value="财经" />
            <el-option label="体育" value="体育" />
            <el-option label="娱乐" value="娱乐" />
            <el-option label="科技" value="科技" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="articleForm.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="articleForm.content" type="textarea" :rows="8" placeholder="请输入文章内容" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-radio-group v-model="articleForm.status">
            <el-radio value="published">发布</el-radio>
            <el-radio value="draft">草稿</el-radio>
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
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const loading = ref(false)
const saveLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新建文章')
const formRef = ref<FormInstance>()

// 搜索表单
const searchForm = reactive({
  title: '',
  status: ''
})

// 文章列表
const articleList = ref([
  {
    id: 1,
    title: '门户网站产品需求文档发布',
    category: '新闻',
    author: 'admin',
    views: 1280,
    status: 'published',
    createdAt: '2024-11-24 10:30'
  },
  {
    id: 2,
    title: 'Vue 3 最佳实践指南',
    category: '科技',
    author: 'admin',
    views: 856,
    status: 'published',
    createdAt: '2024-11-23 15:20'
  },
  {
    id: 3,
    title: 'TypeScript 开发技巧总结',
    category: '科技',
    author: 'admin',
    views: 645,
    status: 'draft',
    createdAt: '2024-11-22 09:15'
  }
])

// 分页
const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 3
})

// 文章表单
const articleForm = reactive({
  id: 0,
  title: '',
  category: '',
  summary: '',
  content: '',
  status: 'draft'
})

// 表单验证规则
const rules = {
  title: [
    { required: true, message: '请输入文章标题', trigger: 'blur' }
  ],
  category: [
    { required: true, message: '请选择文章分类', trigger: 'change' }
  ],
  content: [
    { required: true, message: '请输入文章内容', trigger: 'blur' }
  ]
}

// 加载文章列表
const loadArticles = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取文章列表
    // const data = await getArticles({ ...searchForm, ...pagination })
    // articleList.value = data.list
    // pagination.total = data.total

    // 模拟加载
    setTimeout(() => {
      loading.value = false
    }, 500)
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
    loading.value = false
  }
}

// 搜索
const handleSearch = () => {
  pagination.page = 1
  loadArticles()
}

// 重置
const handleReset = () => {
  searchForm.title = ''
  searchForm.status = ''
  pagination.page = 1
  loadArticles()
}

// 新建文章
const handleCreate = () => {
  dialogTitle.value = '新建文章'
  articleForm.id = 0
  articleForm.title = ''
  articleForm.category = ''
  articleForm.summary = ''
  articleForm.content = ''
  articleForm.status = 'draft'
  dialogVisible.value = true
}

// 编辑文章
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑文章'
  articleForm.id = row.id
  articleForm.title = row.title
  articleForm.category = row.category
  articleForm.summary = row.summary || ''
  articleForm.content = row.content || '这是文章内容...'
  articleForm.status = row.status
  dialogVisible.value = true
}

// 保存文章
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saveLoading.value = true
    try {
      // TODO: 调用API保存文章
      // if (articleForm.id) {
      //   await updateArticle(articleForm.id, articleForm)
      // } else {
      //   await createArticle(articleForm)
      // }

      // 模拟保存
      setTimeout(() => {
        ElMessage.success('保存成功')
        dialogVisible.value = false
        saveLoading.value = false
        loadArticles()
      }, 500)
    } catch (error: any) {
      ElMessage.error(error.message || '保存失败')
      saveLoading.value = false
    }
  })
}

// 删除文章
const handleDelete = (row: any) => {
  ElMessageBox.confirm(`确定要删除文章「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API删除文章
      // await deleteArticle(row.id)

      // 模拟删除
      const index = articleList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        articleList.value.splice(index, 1)
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
  loadArticles()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadArticles()
}

onMounted(() => {
  loadArticles()
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
