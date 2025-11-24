<template>
  <div class="admin-categories">
    <h1 class="page-title">分类管理</h1>

    <el-card>
      <template #header>
        <div class="card-header">
          <span>分类列表</span>
          <el-button type="primary" @click="handleCreate">
            <el-icon>
              <Plus />
            </el-icon>
            新建分类
          </el-button>
        </div>
      </template>

      <!-- 分类列表 -->
      <el-table :data="categoryList" v-loading="loading" stripe style="width: 100%">
        <el-table-column prop="id" label="ID" width="80" />
        <el-table-column prop="name" label="分类名称" min-width="150" />
        <el-table-column prop="slug" label="别名" min-width="150" />
        <el-table-column prop="description" label="描述" min-width="200" />
        <el-table-column prop="sort" label="排序" width="100" />
        <el-table-column prop="articleCount" label="文章数" width="100" />
        <el-table-column prop="createdAt" label="创建时间" width="180" />
        <el-table-column label="操作" width="200" fixed="right">
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
    </el-card>

    <!-- 编辑对话框 -->
    <el-dialog v-model="dialogVisible" :title="dialogTitle" width="600px">
      <el-form :model="categoryForm" :rules="rules" ref="formRef" label-width="100px">
        <el-form-item label="分类名称" prop="name">
          <el-input v-model="categoryForm.name" placeholder="请输入分类名称" />
        </el-form-item>
        <el-form-item label="分类别名" prop="slug">
          <el-input v-model="categoryForm.slug" placeholder="请输入分类别名（英文）" />
        </el-form-item>
        <el-form-item label="分类描述" prop="description">
          <el-input v-model="categoryForm.description" type="textarea" :rows="3" placeholder="请输入分类描述" />
        </el-form-item>
        <el-form-item label="排序" prop="sort">
          <el-input-number v-model="categoryForm.sort" :min="0" :max="999" />
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
import { Plus, Edit, Delete } from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox, type FormInstance } from 'element-plus'

const loading = ref(false)
const saveLoading = ref(false)
const dialogVisible = ref(false)
const dialogTitle = ref('新建分类')
const formRef = ref<FormInstance>()

// 分类列表
const categoryList = ref([
  {
    id: 1,
    name: '时政',
    slug: 'politics',
    description: '时政新闻',
    sort: 1,
    articleCount: 15,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 2,
    name: '社会',
    slug: 'society',
    description: '社会新闻',
    sort: 2,
    articleCount: 8,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 3,
    name: '国际',
    slug: 'international',
    description: '国际新闻',
    sort: 3,
    articleCount: 6,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 4,
    name: '军事',
    slug: 'military',
    description: '军事新闻',
    sort: 4,
    articleCount: 5,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 5,
    name: '财经',
    slug: 'finance',
    description: '财经资讯',
    sort: 5,
    articleCount: 7,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 6,
    name: '体育',
    slug: 'sports',
    description: '体育赛事',
    sort: 6,
    articleCount: 4,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 7,
    name: '娱乐',
    slug: 'entertainment',
    description: '娱乐八卦',
    sort: 7,
    articleCount: 3,
    createdAt: '2024-11-24 10:00'
  },
  {
    id: 8,
    name: '科技',
    slug: 'tech',
    description: '科技前沿',
    sort: 8,
    articleCount: 2,
    createdAt: '2024-11-24 10:00'
  }
])

// 分类表单
const categoryForm = reactive({
  id: 0,
  name: '',
  slug: '',
  description: '',
  sort: 0
})

// 表单验证规则
const rules = {
  name: [
    { required: true, message: '请输入分类名称', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: '请输入分类别名', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: '别名只能包含小写字母、数字和连字符', trigger: 'blur' }
  ]
}

// 加载分类列表
const loadCategories = async () => {
  loading.value = true
  try {
    // TODO: 调用API获取分类列表
    // const data = await getCategories()
    // categoryList.value = data

    // 模拟加载
    setTimeout(() => {
      loading.value = false
    }, 300)
  } catch (error: any) {
    ElMessage.error(error.message || '加载失败')
    loading.value = false
  }
}

// 新建分类
const handleCreate = () => {
  dialogTitle.value = '新建分类'
  categoryForm.id = 0
  categoryForm.name = ''
  categoryForm.slug = ''
  categoryForm.description = ''
  categoryForm.sort = categoryList.value.length + 1
  dialogVisible.value = true
}

// 编辑分类
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑分类'
  categoryForm.id = row.id
  categoryForm.name = row.name
  categoryForm.slug = row.slug
  categoryForm.description = row.description
  categoryForm.sort = row.sort
  dialogVisible.value = true
}

// 保存分类
const handleSave = async () => {
  if (!formRef.value) return

  await formRef.value.validate(async (valid) => {
    if (!valid) return

    saveLoading.value = true
    try {
      // TODO: 调用API保存分类
      // if (categoryForm.id) {
      //   await updateCategory(categoryForm.id, categoryForm)
      // } else {
      //   await createCategory(categoryForm)
      // }

      // 模拟保存
      setTimeout(() => {
        if (categoryForm.id) {
          const index = categoryList.value.findIndex(item => item.id === categoryForm.id)
          if (index > -1) {
            categoryList.value[index] = {
              ...categoryList.value[index],
              ...categoryForm,
              articleCount: categoryList.value[index].articleCount
            }
          }
        } else {
          categoryList.value.push({
            id: Date.now(),
            ...categoryForm,
            articleCount: 0,
            createdAt: new Date().toLocaleString('zh-CN')
          })
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

// 删除分类
const handleDelete = (row: any) => {
  if (row.articleCount > 0) {
    ElMessage.warning('该分类下还有文章，无法删除')
    return
  }

  ElMessageBox.confirm(`确定要删除分类「${row.name}」吗？`, '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  }).then(async () => {
    try {
      // TODO: 调用API删除分类
      // await deleteCategory(row.id)

      // 模拟删除
      const index = categoryList.value.findIndex(item => item.id === row.id)
      if (index > -1) {
        categoryList.value.splice(index, 1)
      }
      ElMessage.success('删除成功')
    } catch (error: any) {
      ElMessage.error(error.message || '删除失败')
    }
  }).catch(() => {
    // 取消删除
  })
}

onMounted(() => {
  loadCategories()
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
</style>
