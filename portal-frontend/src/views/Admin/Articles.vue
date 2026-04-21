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

      <el-form :inline="true" :model="searchForm" class="search-form">
        <el-form-item label="标题">
          <el-input v-model="searchForm.title" placeholder="请输入文章标题" clearable />
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="searchForm.status" placeholder="请选择状态" clearable style="width: 140px">
            <el-option label="全部" value="" />
            <el-option label="已发布" value="published" />
            <el-option label="草稿" value="draft" />
            <el-option label="已下架" value="archived" />
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

      <el-table :data="articleList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="title" label="标题" min-width="200" />
        <el-table-column label="分类" width="120">
          <template #default="{ row }">
            {{ row.categoryName || '—' }}
          </template>
        </el-table-column>
        <el-table-column label="作者" width="120">
          <template #default="{ row }">
            {{ row.authorName || '—' }}
          </template>
        </el-table-column>
        <el-table-column prop="views" label="浏览量" width="100" />
        <el-table-column label="状态" width="100">
          <template #default="{ row }">
            <el-tag :type="row.status === 1 ? 'success' : row.status === 0 ? 'info' : 'warning'">
              {{ statusLabel(row.status) }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="180">
          <template #default="{ row }">
            {{ formatTime(row.createdAt) }}
          </template>
        </el-table-column>
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

      <el-pagination
        v-model:current-page="pagination.page"
        v-model:page-size="pagination.pageSize"
        :page-sizes="[10, 20, 50, 100]"
        :total="pagination.total"
        layout="total, sizes, prev, pager, next, jumper"
        @size-change="handleSizeChange"
        @current-change="handlePageChange"
        class="pagination"
      />
    </el-card>

    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="800px" :close-on-click-modal="false">
      <el-form :model="articleForm" :rules="rules" ref="formRef" label-width="80px">
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleForm.title" placeholder="请输入文章标题" />
        </el-form-item>
        <el-form-item label="分类" prop="categoryId">
          <el-select v-model="articleForm.categoryId" placeholder="请选择分类" style="width: 100%">
            <el-option v-for="c in categories" :key="c.id" :label="c.name" :value="c.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="摘要" prop="summary">
          <el-input v-model="articleForm.summary" type="textarea" :rows="3" placeholder="请输入文章摘要" />
        </el-form-item>
        <el-form-item label="内容" prop="content">
          <el-input v-model="articleForm.content" type="textarea" :rows="10" placeholder="请输入文章内容" />
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
        <el-button type="primary" @click="handleSave" :loading="saveLoading">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Plus, Search, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'
import type { Article } from '@/api/article'
import {
  getAdminArticles,
  getAdminArticle,
  createAdminArticle,
  updateAdminArticle,
  deleteAdminArticle,
  getAdminCategories,
  type AdminCategory,
} from '@/api/admin'

const loading = ref(false)
const saveLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新建文章')
const formRef = ref<FormInstance>()

const categories = ref<AdminCategory[]>([])

const searchForm = reactive({
  title: '',
  status: '' as '' | 'published' | 'draft' | 'archived',
})

const articleList = ref<Article[]>([])

const pagination = reactive({
  page: 1,
  pageSize: 10,
  total: 0,
})

const articleForm = reactive({
  id: 0,
  title: '',
  categoryId: undefined as number | undefined,
  summary: '',
  content: '',
  status: 'draft' as 'published' | 'draft',
})

const rules = {
  title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
  categoryId: [{ required: true, message: '请选择分类', trigger: 'change' }],
  content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }],
}

const statusLabel = (s: number) => {
  if (s === 1) return '已发布'
  if (s === 0) return '草稿'
  return '已下架'
}

const formatTime = (t: string) => {
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return t
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

const loadCategories = async () => {
  try {
    categories.value = await getAdminCategories()
  } catch {
    categories.value = []
  }
}

const loadArticles = async () => {
  loading.value = true
  try {
    const data = await getAdminArticles({
      page: pagination.page,
      pageSize: pagination.pageSize,
      title: searchForm.title || undefined,
      keyword: searchForm.title || undefined,
      status: searchForm.status || undefined,
    })
    articleList.value = data.list || []
    pagination.total = data.total
  } catch (e: any) {
    ElMessage.error(e?.message || '加载失败')
    articleList.value = []
    pagination.total = 0
  } finally {
    loading.value = false
  }
}

const handleSearch = () => {
  pagination.page = 1
  loadArticles()
}

const handleReset = () => {
  searchForm.title = ''
  searchForm.status = ''
  pagination.page = 1
  loadArticles()
}

const handleCreate = () => {
  dialogTitle.value = '新建文章'
  articleForm.id = 0
  articleForm.title = ''
  articleForm.categoryId = categories.value[0]?.id
  articleForm.summary = ''
  articleForm.content = ''
  articleForm.status = 'draft'
  dialogVisible.value = true
}

const handleEdit = async (row: Article) => {
  dialogTitle.value = '编辑文章'
  saveLoading.value = true
  try {
    const full = await getAdminArticle(row.id)
    articleForm.id = full.id
    articleForm.title = full.title
    articleForm.categoryId = full.categoryId
    articleForm.summary = full.summary || ''
    articleForm.content = full.content || ''
    articleForm.status = full.status === 1 ? 'published' : 'draft'
    dialogVisible.value = true
  } catch (e: any) {
    ElMessage.error(e?.message || '加载文章失败')
  } finally {
    saveLoading.value = false
  }
}

const handleSave = async () => {
  if (!formRef.value) return
  await formRef.value.validate(async valid => {
    if (!valid) return
    if (articleForm.categoryId == null) {
      ElMessage.warning('请选择分类')
      return
    }

    saveLoading.value = true
    try {
      const payload = {
        title: articleForm.title,
        content: articleForm.content,
        summary: articleForm.summary,
        categoryId: articleForm.categoryId,
        status: articleForm.status,
      }
      if (articleForm.id) {
        await updateAdminArticle(articleForm.id, payload)
        ElMessage.success('更新成功')
      } else {
        await createAdminArticle(payload)
        ElMessage.success('创建成功')
      }
      dialogVisible.value = false
      await loadArticles()
    } catch (e: any) {
      ElMessage.error(e?.message || '保存失败')
    } finally {
      saveLoading.value = false
    }
  })
}

const handleDelete = (row: Article) => {
  ElMessageBox.confirm(`确定要删除文章「${row.title}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
  })
    .then(async () => {
      await deleteAdminArticle(row.id)
      ElMessage.success('删除成功')
      await loadArticles()
    })
    .catch(() => {})
}

const handleSizeChange = (size: number) => {
  pagination.pageSize = size
  loadArticles()
}

const handlePageChange = (page: number) => {
  pagination.page = page
  loadArticles()
}

onMounted(async () => {
  await loadCategories()
  await loadArticles()
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
